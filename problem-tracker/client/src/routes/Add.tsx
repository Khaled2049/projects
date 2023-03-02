import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Editor from "../components/Editor";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
const Add = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [discussion, setDiscussion] = useState("");

  const handleChange = (event: any) => {
    if (event.target.id === "title") {
      setTitle(event.target.value);
    } else if (event.target.id === "problemCode") {
      setCode(event.target.value);
    } else if (event.target.id === "discussion") {
      setDiscussion(event.target.value);
    } else if (event.target.id === "desc") {
      setDesc(event.target.value);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(title, code, desc, discussion);
  };

  return (
    <div className="container mt-5">
      <Form>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>
            <h2>Title</h2>
          </Form.Label>
          <Form.Control
            value={title}
            onChange={handleChange}
            type="title"
            placeholder="Enter title"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="desc">
          {/* <Editor /> */}
          <Form.Group className="mb-3" controlId="desc">
            <Form.Label>
              <h2>Description</h2>
            </Form.Label>
            <Form.Control
              value={desc}
              onChange={handleChange}
              as="textarea"
              rows={2}
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="mb-3" controlId="problemCode">
          {/* <Editor /> */}
          <Form.Group className="mb-3" controlId="problemCode">
            <Form.Label>
              <h2>Code</h2>
            </Form.Label>
            <Form.Control
              value={code}
              onChange={handleChange}
              as="textarea"
              rows={5}
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="mb-3" controlId="discussion">
          <Form.Group className="mb-3" controlId="discussion">
            <Form.Label>
              <h2>Discussion</h2>
            </Form.Label>
            <Form.Control
              value={discussion}
              onChange={handleChange}
              as="textarea"
              rows={5}
            />
          </Form.Group>
        </Form.Group>

        <Link style={{ textDecoration: "none" }} to={"/"}>
          <Button onClick={handleSubmit}>Submit</Button>
        </Link>
      </Form>
    </div>
  );
};

export default Add;
