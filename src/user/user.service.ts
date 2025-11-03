import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UserService {
  private store: User[] = [];



  create(createUserDto: CreateUserDto) {
    const newUser =  new User(this.store.length, createUserDto.name);
    this.store.push(newUser);
    return newUser;
    }

  findAll() {
    return this.store;
  }

  findOne(id: number) : User | undefined {
    return this.store.find((user) => user.id === id); //=== ist der strikte Vergleich (Typ und Wert müssen gleich sein)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
