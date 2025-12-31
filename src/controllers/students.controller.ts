
import { Request, Response } from "express";
import { getSantriByIdService } from "../services/students/getStudent.service";
import { getAllSantriService } from "../services/students/getAllStudents.service";
import { editSantriService } from "../services/students/editStudent.service";
import { createSantriService } from "../services/students/createStudent.service";

export class StudentController {  
  async createStudentController(req: Request, res: Response) {
    try {
      const { name,  generation, status, grade } = req.body;

      const Student = await createSantriService({
        name: name,
        grade: grade,
        status: status,
        generation: generation,
      });

      res.status(200).send(Student);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async getStudentByIdController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const Student = await getSantriByIdService({
        id
      });

      res.status(200).send(Student);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async getAllStudentController(req: Request, res: Response) {
    try {
      const Student = await getAllSantriService(req.query);

      res.status(200).send(Student);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

  async editStudentController(req: Request, res: Response) {
    try {
        const { id } = req.params;
      const { name,  generation, status, grade } = req.body;

      const Student = await editSantriService({
        id:id,
        name: name,
        grade: grade,
        status: status,
        generation: generation,
      });

      res.status(200).send(Student);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }

}
