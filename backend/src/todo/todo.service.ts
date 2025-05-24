import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

type Todo = Prisma.TodoGetPayload<{}>;

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async create(data: { title: string; description?: string }): Promise<Todo> {
    return this.prisma.todo.create({
      data,
    });
  }

  async update(
    id: number,
    data: { title?: string; description?: string; completed?: boolean },
  ): Promise<Todo> {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Todo> {
    return this.prisma.todo.delete({
      where: { id },
    });
  }

  async incrementStudyCount(id: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new Error(`ID ${id} のタスクが見つかりません`);
    }

    // 学習回数を増やし、定着率を更新
    const newStudyCount = (todo as any).studyCount + 1;
    const newRetention = Math.min(1.0, (todo as any).retention + 0.2); // 学習するごとに定着率が20%上昇

    return this.prisma.todo.update({
      where: { id },
      data: {
        studyCount: newStudyCount,
        retention: newRetention,
      },
    });
  }
}
