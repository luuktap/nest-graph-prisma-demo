import { Field, ObjectType } from '@nestjs/graphql';
import { Todo } from 'src/todo/todo';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => [Todo], { nullable: true })
  todos: [Todo] | null;
}
