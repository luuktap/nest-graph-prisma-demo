import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user';

@ObjectType()
export class Todo {
  @Field()
  id: number;

  @Field()
  content: string;

  @Field()
  done: boolean;

  @Field(() => User, { nullable: true })
  user: User | null;
}
