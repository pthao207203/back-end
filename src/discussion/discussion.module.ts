import { Module } from '@nestjs/common';
import { DiscussionController } from './controllers/discussion.controller';
import { DiscussionService } from './services/discussion.service';

@Module({
  controllers: [DiscussionController],
  providers: [DiscussionService]
})
export class DiscussionModule {}
