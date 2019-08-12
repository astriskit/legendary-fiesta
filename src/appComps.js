import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Select, Table, Loading } from "./utilComps";
import {
  getStudents,
  getStudent,
  getRegistrations,
  getRegistration,
  addRegistration,
  removeRegistration,
  getSubjects,
  getSubject,
  getClassRooms,
  getClassRoom,
  updateClassRoom
} from "./service";

export function Navigation() {
  return (
    <div className="w3-bar w3-light-grey w3-border">
      <Link className="w3-bar-item w3-btn" to="/">
        Home
      </Link>
      <Link className="w3-bar-item w3-btn" to="/students">
        Students
      </Link>
      <Link className="w3-bar-item w3-btn" to="/registrations">
        Registrations
      </Link>
      <Link className="w3-bar-item w3-btn" to="/registrations/create">
        Create Registrations
      </Link>
      <Link className="w3-bar-item w3-btn" to="/subjects">
        Subjects
      </Link>
      <Link className="w3-bar-item w3-btn" to="/classrooms">
        Class room
      </Link>
    </div>
  );
}
export function Home(props) {
  return "Home";
}

export function ListStudents(props) {
  // {
  //   "age": 29,
  //   "email": "susanpetersen@example.com",
  //   "id": 1,
  //   "name": "Susan Petersen"
  // }
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Age", key: "age", dataIndex: "age" },
    { title: "Email", key: "email", dataIndex: "email" }
  ];
  return (
    <Table
      service={getStudents}
      columns={columns}
      responseFilter={data => data.students}
      title="List of Students"
    />
  );
}

const SubjectSelect = ({
  record: rec,
  setClassrooms,
  classrooms,
  subjects
}) => {
  let selectRef = useRef(null);
  let [saving, setSaving] = useState(false);
  useEffect(() => {
    selectRef.current.value = rec.value || null;
  }, [rec]);
  return (
    <>
      {saving && <Loading />}
      <Select
        ref={selectRef}
        disabled={saving}
        value={rec.value}
        options={subjects}
        onChange={async ({ target: { value } }) => {
          try {
            setSaving(true);
            await updateClassRoom(rec.id, { subject: value });
            let newRecords = classrooms.map(classroom => {
              if (rec.id === classroom.id) {
                classroom.value = value;
              }
              return classroom;
            });
            setClassrooms(newRecords);
          } catch (er) {
            selectRef.current.value = rec.value;
            console.error(er);
            alert("Error while saving!");
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
};

export function ListClassRooms(props) {
  // {
  //   "id": 1,
  //   "layout": "conference",
  //   "name": "NavajoWhite",
  //   "size": 24,
  //   "subject": ""
  // }

  let [loading, setLoading] = useState(true);
  let [subjects, setSubjects] = useState([]);
  let [classrooms, setClassrooms] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        let { subjects } = await getSubjects();
        let { classrooms } = await getClassRooms();
        let opts = subjects.map(({ id, name, credits, teacher }) => ({
          key: id,
          value: id,
          title: `${name} by ${teacher} (Credits: ${credits})`
        }));
        setSubjects(opts);
        setClassrooms(classrooms);
      } catch (er) {
        console.error(er);
        alert("Error fetching subjects/classrooms!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Layout", key: "layout", dataIndex: "layout" },
    { title: "Size", key: "size", dataIndex: "size" },
    {
      title: "Subject",
      key: "subject",
      render: record => (
        <SubjectSelect
          record={record}
          setClassrooms={setClassrooms}
          classrooms={classrooms}
          subjects={subjects}
        />
      )
    }
  ];
  if (loading) return <Loading />;
  return (
    <Table data={classrooms} columns={columns} title="List of Classrooms" />
  );
}

export function ListRegistrations(props) {
  //   {
  //   "registration": {
  //     "id": 4,
  //     "student": 5,
  //     "subject": 3
  //   }
  // }
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Student Id", key: "student", dataIndex: "student" },
    { title: "Subject Id", key: "subject", dataIndex: "subject" },
    {
      title: "Delete",
      key: "delete",
      render: rec => (
        <button
          onClick={async () => {
            await removeRegistration(rec.id);
          }}
        >
          Delete
        </button>
      )
    }
  ];
  return (
    <Table
      title="List of Registrations"
      service={getRegistrations}
      columns={columns}
      responseFilter={data => data.registrations}
    />
  );
}
export function CreateRegistration(props) {
  const options = [1, 3, 4, 5, 66, 36].map(n => ({
    key: n,
    value: n,
    title: n
  }));
  return (
    <Form
      onSubmit={values => {
        let payload = {};
        values.forEach(({ name, value }) => {
          payload[name] = value;
        });
        return addRegistration(
          Number(payload.student),
          Number(payload.subject)
        );
      }}
    >
      <Select options={options} name="student" label="Student Id" />
      <Select options={options} name="subject" label="Subject Id" />
    </Form>
  );
}
export function ListSubjects(props) {
  //   {
  //   "credits": 10,
  //   "id": 1,
  //   "name": "History",
  //   "teacher": "Brenda Miller"
  // }
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Credits", key: "credits", dataIndex: "credits" },
    { title: "Teacher", key: "teacher", dataIndex: "teacher" }
  ];
  return (
    <Table
      title="List of Subjects"
      service={getSubjects}
      columns={columns}
      responseFilter={data => data.subjects}
    />
  );
}
