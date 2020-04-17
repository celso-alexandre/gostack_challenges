import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string().required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email } = req.body;
    const studentExists = await Student.findOne({ where: { email } });

    if (studentExists) {
      res.status(401).json({ error: 'E-mail already in use' });
    }
    const student = await Student.create(req.body);
    return res.json(student);
  }
}

export default new StudentController();
