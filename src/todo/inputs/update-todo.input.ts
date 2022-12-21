import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTodoInput {
  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  done?: boolean;
}
