/*
  Warnings:

  - Added the required column `config` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "config" JSONB NOT NULL;
