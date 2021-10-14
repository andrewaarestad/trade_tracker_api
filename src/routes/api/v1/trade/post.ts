import {CreateTradeDto} from '../../../../models/dto/input-dtos/create-trade-dto';
import {Mapper} from '../../../../models/dto/mapping/mapper';
import {TradeDto} from '../../../../models/dto/output-dtos/trade-dto';
import {TradeService} from '../../../../services/load/trade-service';
import {AuthenticatedUserController} from '../../../classes/controller';

export class CreateTradeController extends AuthenticatedUserController {
  public async handleRequest() {
    const body = await Mapper.mapInput(this.request.body, CreateTradeDto);
    const saved = await TradeService.createTrade(this.requestingUser.id, body);
    return Mapper.mapOutput(saved, TradeDto);
  }
}
