import crypto from "crypto";

export interface MockRequest {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  ended: boolean;
  status(code: number): MockResponse;
  setHeader(name: string, value: string): MockResponse;
  json(data: any): MockResponse;
  end(): MockResponse;
}

export function createMockResponse(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    headers: {},
    body: null,
    ended: false,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name] = value;
      return this;
    },
    json(data: any) {
      this.body = data;
      this.ended = true;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
  return res;
}

export const TEST_JWT_SECRET =
  process.env.JWT_SECRET || "TAMENG_PPKSP_SECURE_AUTH_SIGNING_KEY_2026";

export function generateTestJWT(
  payload: Record<string, any>,
  secret: string = TEST_JWT_SECRET,
  expiresInSeconds: number = 3600,
): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString(
    "base64url",
  );
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function generateExpiredTestJWT(
  payload: Record<string, any>,
  secret: string = TEST_JWT_SECRET,
): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString(
    "base64url",
  );
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export const TEST_USERS = {
  counselor: {
    id: "b0000000-0000-0000-0000-000000000001",
    email: "guru.bk@sekolah.sch.id",
    role: "guru",
    school_id: "default-school",
  },
  admin: {
    id: "b0000000-0000-0000-0000-000000000002",
    email: "admin@sekolah.sch.id",
    role: "admin",
    school_id: "default-school",
  },
  disdik: {
    id: "b0000000-0000-0000-0000-000000000003",
    email: "disdik@pemprov.go.id",
    role: "dinas-pendidikan",
    school_id: "regional-dkijakarta",
  },
  dppa: {
    id: "b0000000-0000-0000-0000-000000000004",
    email: "uptd.ppa@dppapp.jakarta.go.id",
    role: "dinas-perlindungan",
    school_id: "uptd-regional",
  },
  student: {
    id: "anonymous-student-id",
    email: "student@anon.sch.id",
    role: "siswa",
    school_id: "default-school",
  },
};
