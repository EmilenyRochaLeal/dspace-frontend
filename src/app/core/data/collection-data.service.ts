import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Collection } from '../shared/collection.model';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { hasValue, isNotEmptyOperator } from '../../shared/empty.util';
import { GetRequest } from './request.models';
import { configureRequest } from '../shared/operators';
import { PaginatedSearchOptions } from '../../+search-page/paginated-search-options.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { ResponseParsingService } from './parsing.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { DSOResponseParsingService } from './dso-response-parsing.service';

@Injectable()
export class CollectionDataService extends ComColDataService<NormalizedCollection, Collection> {
  protected linkPath = 'collections';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected cds: CommunityDataService,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService
  ) {
    super();
  }

  /**
   * Fetches the endpoint used for mapping items to a collection
   * @param collectionId   The id of the collection to map items to
   */
  getMappingItemsEndpoint(collectionId): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getFindByIDHref(endpoint, collectionId)),
      map((endpoint: string) => `${endpoint}/mappingItems`)
    );
  }

  /**
   * Fetches a list of items that are mapped to a collection
   * @param collectionId    The id of the collection
   * @param searchOptions   Search options to sort or filter out items
   */
  getMappedItems(collectionId: string, searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<DSpaceObject>>> {
    const requestUuid = this.requestService.generateRequestId();

    const href$ = this.getMappingItemsEndpoint(collectionId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) => hasValue(searchOptions) ? searchOptions.toRestUrl(endpoint) : endpoint)
    );

    href$.pipe(
      map((endpoint: string) => {
        const request = new GetRequest(requestUuid, endpoint);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return DSOResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService)
    ).subscribe();

    return this.rdbService.buildList(href$);
  }

  /**
   * Clears all requests (from cache) connected to the mappingItems endpoint
   * @param collectionId
   */
  clearMappingItemsRequests(collectionId: string) {
    this.getMappingItemsEndpoint(collectionId).pipe(take(1)).subscribe((href: string) => {
      this.requestService.removeByHrefSubstring(href);
    });
  }

}
