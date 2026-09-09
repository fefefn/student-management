/**
 * End-to-end API smoke test.
 *
 * Usage:  1) start the API:  npm run dev      2) in another terminal:  npm run smoke
 *         (or  BASE_URL=http://localhost:5000/api node scripts/api-smoke-test.mjs)
 *
 * Exercises every endpoint (auth, courses, students, dashboard) including
 * validation, auth guards, pagination/search and delete protection.
 * Creates its own test data and cleans up after itself. Requires Node 18+.
 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:5000/api";
const stamp = Date.now();

let token = "";
let passed = 0;
let failed = 0;

const request = async (method, path, body, auth = true) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON body */
  }
  return { status: res.status, json };
};

const check = (label, condition, detail = "") => {
  if (condition) {
    passed++;
    console.log(`  ✔ ${label}`);
  } else {
    failed++;
    console.log(`  ✘ ${label}${detail ? `  -> ${detail}` : ""}`);
  }
};

const section = (title) => console.log(`\n${title}`);

const run = async () => {
  console.log(`Smoke testing ${BASE_URL}`);

  section("Health");
  let r = await request("GET", "/health", undefined, false);
  check("GET /health returns 200", r.status === 200, JSON.stringify(r.json));

  section("Auth");
  const email = `smoke.${stamp}@example.com`;
  const password = "Secret123";

  r = await request("POST", "/auth/register", { name: "Smoke Tester", email, password }, false);
  check("register returns 201 + token", r.status === 201 && !!r.json?.data?.token, JSON.stringify(r.json));
  check("register never returns password hash", r.json?.data?.user?.password === undefined);

  r = await request("POST", "/auth/register", { name: "Smoke Tester", email, password }, false);
  check("duplicate register returns 409", r.status === 409);

  r = await request("POST", "/auth/register", { name: "A", email: "bad", password: "1" }, false);
  check("invalid register returns 400 with field errors", r.status === 400 && Array.isArray(r.json?.errors));

  r = await request("POST", "/auth/login", { email, password: "wrong-password" }, false);
  check("wrong password returns 401", r.status === 401);

  r = await request("POST", "/auth/login", { email, password }, false);
  check("login returns 200 + token", r.status === 200 && !!r.json?.data?.token);
  token = r.json?.data?.token ?? "";

  r = await request("GET", "/auth/profile", undefined, false);
  check("profile without token returns 401", r.status === 401);

  r = await request("GET", "/auth/profile");
  check("profile with token returns the user", r.status === 200 && r.json?.data?.email === email);

  section("Courses");
  r = await request("POST", "/courses", { name: "", description: "short", duration: "", fees: -1 });
  check("invalid course returns 400", r.status === 400);

  r = await request("POST", "/courses", {
    name: `Full Stack Web Development ${stamp}`,
    description: "MERN stack from fundamentals to deployment.",
    duration: "6 months",
    fees: 45000,
  });
  check("create course returns 201", r.status === 201, JSON.stringify(r.json));
  const courseId = r.json?.data?._id;

  r = await request("GET", "/courses");
  check("list courses includes the new course with studentCount", r.status === 200 && r.json.data.some((c) => c._id === courseId && c.studentCount === 0));

  r = await request("PUT", `/courses/${courseId}`, { fees: 48000 });
  check("update course returns updated fees", r.status === 200 && r.json?.data?.fees === 48000);

  r = await request("GET", "/courses/000000000000000000000000");
  check("unknown course returns 404", r.status === 404);

  r = await request("GET", "/courses/not-an-id");
  check("malformed course id returns 400", r.status === 400);

  section("Students");
  r = await request("POST", "/students", { name: "X" });
  check("invalid student returns 400 with field errors", r.status === 400 && r.json?.errors?.length > 0);

  const studentBody = {
    name: "Aarav Sharma",
    email: `aarav.${stamp}@example.com`,
    phone: "+91 98765 43210",
    gender: "male",
    dateOfBirth: "2003-05-14",
    address: "221B MG Road, Indore, MP",
    course: courseId,
    enrollmentDate: "2026-07-01",
  };
  r = await request("POST", "/students", studentBody);
  check("create student returns 201 with generated studentId", r.status === 201 && /^STU-\d{4}-\d{4}$/.test(r.json?.data?.studentId ?? ""), JSON.stringify(r.json));
  check("created student has populated course", r.json?.data?.course?.name !== undefined);
  const studentId = r.json?.data?._id;

  r = await request("POST", "/students", studentBody);
  check("duplicate student email returns 409", r.status === 409);

  r = await request("POST", "/students", { ...studentBody, email: `other.${stamp}@example.com`, course: "000000000000000000000000" });
  check("student with unknown course returns 400", r.status === 400);

  r = await request("GET", `/students?search=aarav.${stamp}&page=1&limit=5`);
  check("search + pagination returns the student", r.status === 200 && r.json.data.length === 1 && r.json.pagination.total === 1);

  r = await request("GET", `/students?status=graduated&course=${courseId}`);
  check("status filter excludes active student", r.status === 200 && r.json.data.length === 0);

  r = await request("GET", "/students?status=bogus");
  check("invalid filter value returns 400", r.status === 400);

  r = await request("GET", `/students/${studentId}`);
  check("get student by id returns student", r.status === 200 && r.json?.data?._id === studentId);

  r = await request("PUT", `/students/${studentId}`, { status: "graduated", phone: "9876543210" });
  check("update student changes status", r.status === 200 && r.json?.data?.status === "graduated");

  r = await request("DELETE", `/courses/${courseId}`);
  check("deleting a course with enrolled students is blocked (409)", r.status === 409);

  section("Dashboard");
  r = await request("GET", "/dashboard/stats");
  check("stats returns counts and recent students", r.status === 200 && r.json.data.totalStudents >= 1 && r.json.data.totalCourses >= 1 && Array.isArray(r.json.data.recentStudents));

  section("Cleanup");
  r = await request("DELETE", `/students/${studentId}`);
  check("delete student returns 200", r.status === 200);

  r = await request("GET", `/students/${studentId}`);
  check("deleted student returns 404", r.status === 404);

  r = await request("DELETE", `/courses/${courseId}`);
  check("delete course (now empty) returns 200", r.status === 200);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
};

run().catch((error) => {
  console.error(`\nCould not reach the API at ${BASE_URL}. Is the server running?\n`, error.message);
  process.exit(1);
});
