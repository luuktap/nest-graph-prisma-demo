import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {
  @Field()
  content: string;

  @Field()
  done: boolean;

  @Field()
  userId: number;
}
