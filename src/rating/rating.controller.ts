import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../user/decorators/user.decorator';
import { Types } from 'mongoose';
import { idValidationPipe } from 'src/pipes/id.validation.pipe';
import { SetRatingDto } from './dto/set-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', idValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId,
  ) {
    return this.ratingService.getMovieValueByUser(movieId, _id);
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @Auth()
  async setRating(@User('_id') _id: Types.ObjectId, @Body() dto: SetRatingDto) {
    return this.ratingService.setRating(_id, dto);
  }
}
