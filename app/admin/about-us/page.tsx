'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditAboutUs() {
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get("/api/page-content?slug=about-us").then((res) => {
      setContent(res.data?.content || "");
    });
  }, []);

  const handleSave = () => {
    axios
      .put("/api/page-content", {
        slug: "about-us",
        content,
      })
      .then(() => alert("Saved!"));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit About Us</h1>
      <Textarea
        className="w-full h-96"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button className="mt-4" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
