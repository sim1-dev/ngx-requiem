import { ApiRequest } from "../../../lib/api/request/request.model";
import { ApiRequestFilter } from "../../../lib/api/request/filter/filter.model";
import { Team } from "./team.model";
import { ApiRequestPagination } from "../../../lib/api/request/pagination/pagination.model";
import { ApiRequestOrder } from "../../../lib/api/request/order/order.model";

export class TeamRequest extends ApiRequest<TeamRequestFilter> {
    private teamName?: string
    private action?: string

    setTeamName(name: string): this {
        this.teamName = name
        return this
    }

    setAction(action: string): this {
        this.action = action
        return this
    }
}

export class TeamRequestFilter extends ApiRequestFilter<Team> {}
export class TeamRequestOrder extends ApiRequestOrder {}
export class TeamRequestPagination extends ApiRequestPagination {}