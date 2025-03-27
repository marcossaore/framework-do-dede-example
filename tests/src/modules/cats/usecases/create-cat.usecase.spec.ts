import { CatEntity } from "@/modules/cats/cat.entity";
import { type ExistsByNameAndTutorIdRepository } from "@/modules/cats/cat.repository";
import { CreateCat } from "@/modules/cats/usecases/create-cat.usecase";
import { describe, test, expect, jest } from "bun:test";
import { Conflict, type CreateRepository } from "framework-do-dede";

describe("CreateCat UseCase", () => {
  const mockTutorId = "test-tutor-id";

  test("throws Conflict error if cat exists with same name and tutor ID", async () => {
    // Mock repository with existing cat
    const mockRepo: CreateRepository<CatEntity> & ExistsByNameAndTutorIdRepository = {
      existsByNameAndTutorId: jest.fn(() => Promise.resolve(true)),
      create: jest.fn(),
    };

    const createCat = new CreateCat(mockRepo);
    // Simulate authenticated user
    (createCat as any).auth = { id: mockTutorId };

    // Attempt to create duplicate cat
    expect(createCat.execute({ name: "Whiskers" })).rejects.toThrow(Conflict);
    
    // Verify repository interactions
    expect(mockRepo.existsByNameAndTutorId).toHaveBeenCalledWith(
      mockTutorId,
      "Whiskers"
    );
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  test("creates new cat when no naming conflict", async () => {
    // Mock repository with no existing cat
    const mockRepo: CreateRepository<CatEntity> & ExistsByNameAndTutorIdRepository = {
      existsByNameAndTutorId: jest.fn(() => Promise.resolve(false)),
      create: jest.fn(),
    };

    const createCat = new CreateCat(mockRepo);
    // Simulate authenticated user
    (createCat as any).auth = { id: mockTutorId };

    // Create new cat
    await createCat.execute({ name: "Whiskers" });

    // Verify repository interactions
    expect(mockRepo.existsByNameAndTutorId).toHaveBeenCalledWith(
      mockTutorId,
      "Whiskers"
    );
    expect(mockRepo.create).toHaveBeenCalledTimes(1);

    // @ts-ignore
    const createdCat: CatEntity = mockRepo.create.mock.calls[0][0];
    expect(createdCat).toBeInstanceOf(CatEntity);
    // @ts-ignore
    expect(createdCat.name).toBe("Whiskers");
    // @ts-ignore
    expect(createdCat.tutorId).toBe(mockTutorId);
  });
});