"use client"
import { useAddTodoMutation, useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from "@/redux/apis/todo.api"
import { Todo } from "@/types/Todo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, Form, Table } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const Home = () => {
  const { data } = useGetTodosQuery()
  const [addTodo] = useAddTodoMutation()
  const [updateTodo] = useUpdateTodoMutation()
  const [deleteTodo] = useDeleteTodoMutation()

  const todoSchema = z.object({
    task: z.string().min(1),
    desc: z.string().min(1),
    priority: z.string().min(1),
  })

  type todoType = z.infer<typeof todoSchema>

  const { reset, register, formState: { errors }, handleSubmit } = useForm<todoType>({
    defaultValues: {
      task: "",
      desc: "",
      priority: "",
    },
    resolver: zodResolver(todoSchema)
  })

  const handleCreate = (values: todoType) => {
    handleAdd(values)
    reset()
  }

  const handleAdd = async (data: todoType) => {
    try {
      await addTodo(data).unwrap()
      toast.success("todo create success");
    } catch (error) {
      toast.error("unable to create todo")
    }
  }

  const handleRemove = async (_id: string) => {
    try {
      await deleteTodo(_id).unwrap()
      toast.success("todo delete success")
    } catch (error) {
      toast.error("unable to delete todo")
    }
  }


  const handleUpdate = async (data: todoType, isComplete: boolean) => {
    try {
      await updateTodo({ ...data, complete: isComplete }).unwrap()
      toast.success("todo update success")
    } catch (error) {
      toast.error("unable to update todo")
    }
  }


  return <>
    <Card>
      <Card.Header>Todo Task</Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit(handleCreate)}>
          <Form.Control {...register("task")} type="text" placeholder="enter task" />
          <Form.Control {...register("desc")} type="text" placeholder="enter desc" />
          <Form.Select {...register("priority")}>
            <option value="">Choose priority</option>
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </Form.Select>
          <Button variant="primary" type="submit">add todo</Button>
        </form>
      </Card.Body>

    </Card>


    {
      data && <Table className="table border">
        <thead>
          <tr>
            <th>id</th>
            <th>task</th>
            <th>desc</th>
            <th>priority</th>
            <th>complete</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map(item => <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.task}</td>
              <td>{item.desc}</td>
              <td>{item.priority}</td>
              <td>{item.complete ? "Complete" : "Pending"}</td>
              <td>
                {
                  item.complete
                    ? <Button variant="warning" onClick={e => handleUpdate(item, false)}>Un-publish</Button>
                    : <Button variant="success" onClick={e => handleUpdate(item, true)}>Publish</Button>
                }

                <Button variant="danger" onClick={e => handleRemove(item._id as string)}>Remove</Button>
              </td>
            </tr>)
          }
        </tbody>
      </Table>
    }
  </>
}

export default Home