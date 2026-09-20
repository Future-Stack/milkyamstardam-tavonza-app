import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController, BranchRestaurantController } from './branch.controller';

@Module({
  controllers: [BranchRestaurantController, BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
