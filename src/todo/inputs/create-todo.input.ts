import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {
  @Field()
  content: string;

  @Field({ nullable: true })
  done?: boolean;
}
