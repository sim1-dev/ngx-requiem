
import { TestBed } from '@angular/core/testing';
import { QueryOperator } from '../../../lib/api/request/filter/query-operator.model';
import { TeamApiService } from './team.api.service';
import { Team } from './team.model';
import { TeamRequest, TeamRequestFilter, TeamRequestOrder, TeamRequestPagination } from './team.request.model';
import { NgxRequiemModule } from '../../../public-api';
import { OrderDirection } from '../../../lib/api/request/order/order.model';

import { ApiResponse } from '../../../lib/api/response/response.model';
import { map, of, tap } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { API_CONFIG } from '../../../lib/api/api-config.token';

describe('TeamApiService', () => {
    let service: TeamApiService
    let http: HttpTestingController

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                NgxRequiemModule, 
                HttpClientTestingModule
            ],
            providers: [
                TeamApiService,
                {
                    provide: API_CONFIG,
                    useValue: { url: 'http://test-api.com' }
                }
            ]
        })
        .compileComponents()
    })

    beforeEach(() => {
        service = TestBed.inject(TeamApiService)
        http = TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
        http.verify()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should compose fetch team GET request correctly', () => {
        const request: TeamRequest = new TeamRequest()
            .setFilter(new TeamRequestFilter()
                .addCondition('id', QueryOperator.GREATER, 5)
                .addCondition('name', QueryOperator.LIKE, 'TeamBallo')
            )
            .setOrder(new TeamRequestOrder()
                .setField('id')
                .setDirection(OrderDirection.ASC)
            )
            .setPagination(new TeamRequestPagination()
                .setPage(3)
                .setSize(20)
            )

        //console.log(request.toHttpParamsLegacy().toString(), "TeamRequest Params Legacy")
        console.log(request.toHttpParams().toString(), "TeamRequest GET params")


        const mockResponse: ApiResponse<Team[]> = {
            success: true,
            total: 2,
            dto: [
                {
                    id: 6,
                    name: 'TeamBallo'
                },
                {
                    id: 7,
                    name: 'TeamBalloCharlie'
                }
            ]
        }

        const getTeamsSpy: jasmine.Spy = spyOn(service, 'getTeams').and.returnValue(of(mockResponse))

        service.getTeams(request).pipe(
            tap((response: ApiResponse<Team[]>) => expect(response).toEqual(mockResponse)),
            map((response: ApiResponse<Team[]>) => response.dto as Team[])
        )
        .subscribe()

        expect(getTeamsSpy).toHaveBeenCalledWith(request)
    })



    it('should compose team POST request correctly', () => {
        const request: TeamRequest = new TeamRequest()
            .setTeamName('Teamu')
            .setAction('rename')

        
        const mockResponse: ApiResponse<Team> = {
            success: true
        }

        service.performActionTeam(request)
        .subscribe((response: ApiResponse<Team>) => {
            expect(response).toEqual(mockResponse)
        })

        const httpRequest: TestRequest = http.expectOne('http://test-api.com/teams/action')
        expect(httpRequest.request.method).toBe('POST')

        
        console.log(httpRequest.request.body, 'TeamRequest POST payload')


        expect(httpRequest.request.body).toEqual(request)


        httpRequest.flush(mockResponse)
    })

})