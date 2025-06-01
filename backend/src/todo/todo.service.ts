import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async create(
    data: { title: string; description?: string },
    userId: number,
  ): Promise<Todo> {
    console.log(userId)
    return this.prisma.todo.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(
    id: number,
    data: { title?: string; description?: string },
    userId: number,
  ): Promise<Todo> {
    return this.prisma.todo.update({
      where: {
        id: id,
        userId: userId,
      },
      data,
    });
  }

  async delete(id: number, userId: number): Promise<Todo> {
    return this.prisma.todo.delete({
      where: {
        id: id,
        userId: userId,
      },
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
