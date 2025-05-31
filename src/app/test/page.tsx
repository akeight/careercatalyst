"use client";

import { trpc } from "../../lib/trpc/client";
import { useState } from "react";

export default function TestPage() {
  const [name, setName] = useState("World");

  const { data: helloData, isLoading: helloLoading } =
    trpc.example.hello.useQuery({ name }, { enabled: !!name });

  const { data: allData, isLoading: allLoading } =
    trpc.example.getAll.useQuery();

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>tRPC Test Page</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Hello Query Test</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          style={{
            padding: "0.5rem",
            marginRight: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {helloLoading ? (
          <p>Loading...</p>
        ) : helloData ? (
          <div>
            <p>
              <strong>Greeting:</strong> {helloData.greeting}
            </p>
            <p>
              <strong>Timestamp:</strong> {helloData.timestamp}
            </p>
          </div>
        ) : null}
      </div>

      <div>
        <h2>Get All Query Test</h2>
        {allLoading ? (
          <p>Loading...</p>
        ) : allData ? (
          <div>
            <p>
              <strong>Message:</strong> {allData.message}
            </p>
            <p>
              <strong>Items:</strong>
            </p>
            <ul>
              {allData.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
        }}
      >
        <p>
          <strong>Status:</strong>{" "}
          {helloData || allData ? "✅ tRPC is working!" : "⏳ Loading..."}
        </p>
      </div>
    </div>
  );
}
