/**
 * Contains all the network services for connecting with api
 */
async function baseFetch(
  resource,
  { method = "GET", data = null, inUrl = true, ...rest } = {}
) {
  try {
    const api_key = "8Eb6a";
    const base_url = "https://hamon-interviewapi.herokuapp.com/";
    resource = base_url + resource;
    resource += `?api_key=${api_key}`;
    if (data) {
      let urlParams = "";
      for (let key in data) {
        urlParams += `&${key}=${data[key]}`;
      }
      resource += urlParams;
    }
    let res = await fetch(resource, {
      method,
      mode: "cors",
      ...rest
    });
    if (!res.ok) {
      throw new Error(res);
    } else {
      let resJSON = await res.json();
      return resJSON;
    }
  } catch (err) {
    throw err;
  }
}

/**
 * students
 */
export function getStudents() {
  return baseFetch("students");
}
export function getStudent(id) {
  return baseFetch(`students/${id}`);
}

/**
 * student - registration
 */
export function getRegistrations() {
  return baseFetch("registration");
}
export function getRegistration(id) {
  return baseFetch(`registration/${id}`);
}
export function addRegistration(studentId, subjectId) {
  return baseFetch("registration", {
    method: "POST",
    data: { student: studentId, subject: subjectId }
  });
}
export function removeRegistration(id) {
  return baseFetch(`registration/${id}`, { method: "DELETE" });
}

/**
 * subjects
 */
export function getSubjects() {
  return baseFetch("subjects");
}
export function getSubject(id) {
  return baseFetch(`subjects/${id}`);
}

/**
 * classrooms
 */
export function getClassRooms() {
  return baseFetch("classrooms");
}
export function getClassRoom(id) {
  return baseFetch(`classrooms/${id}`);
}
export function updateClassRoom(id, data) {
  return baseFetch(`classrooms/${id}`, {
    method: "PUT",
    data
  });
}
