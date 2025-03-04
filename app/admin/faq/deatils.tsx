"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import useSWRMutation from "swr/mutation"; // Ensure this import is correct
import toast from "react-hot-toast";

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface FAQData {
  question: string;
  answer: string;
  _id?: string; // _id is optional when creating a new FAQ
}

const FAQAdmin = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [newFaq, setNewFaq] = useState<{ question: string; answer: string }>({
    question: "",
    answer: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch FAQs from API when the component mounts
  useEffect(() => {
    const fetchFaqs = async () => {
      const response = await fetch("/api/admin/faqs");
      const data: Faq[] = await response.json();
      setFaqs(data);
    };
    fetchFaqs();
  }, []);

  // useSWRMutation for handling the FAQ create/update API call
  const { trigger: createFAQ, isMutating: isCreating } = useSWRMutation(
    "/api/admin/faqs",
    async (url, { arg }: { arg: FAQData }) => {
      const res = await fetch(url, {
        method: "POST", // POST for both create and update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg), // Send newFaq as body
      });
      const data = await res.json();
      console.log("dara", data);
      if (!res.ok) throw new Error(data.message); // Handle error from server
      toast.success(data?.message);
      return data; // Return the data if the response is successful
    }
  );

  const handleCreateOrUpdateFAQ = async () => {
    if (!newFaq.question || !newFaq.answer) return;

    try {
      // Prepare the FAQ data
      const faqData: FAQData = {
        // Only include _id if we are editing an existing FAQ
        ...(isEditing &&
          editingIndex !== null && { _id: faqs[editingIndex]._id }),
        question: newFaq.question,
        answer: newFaq.answer,
      };

      const responseData = await createFAQ(faqData); // Call the mutation

      // Optimistic update: Immediately update the list
      if (editingIndex !== null) {
        // Update the existing FAQ in the list
        const updatedFaqs = faqs.map((faq, index) =>
          index === editingIndex ? responseData.faq : faq
        );
        setFaqs(updatedFaqs);
      } else {
        // Add the new FAQ to the list
        setFaqs((prevFaqs) => [...prevFaqs, responseData.faq]);
      }

      // Clear input fields after submission
      setNewFaq({ question: "", answer: "" });
      setIsEditing(false);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error creating/updating FAQ:", error);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    const response = await fetch(`/api/admin/faqs`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }), // Send _id as JSON in the body
    });

    if (response.ok) {
      // Optimistic update after deletion
      setFaqs(faqs.filter((faq) => faq._id !== id));
      const data = await response.json();
      toast.success(data?.message);
    } else {
      const errorData = await response.json();
      console.error("Error deleting FAQ:", errorData.message);
    }
  };

  return (
    <div className="faq-admin container mx-auto p-6">
      <h1 className="text-center text-4xl font-bold mb-10">Manage FAQs</h1>

      {/* New FAQ Form */}
      <div className="create-faq mb-8">
        <h2 className="text-xl font-semibold mb-4">Create or Edit FAQ</h2>
        <input
          type="text"
          placeholder="Question"
          className="border p-2 w-full mb-4"
          value={newFaq.question}
          onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
        />
        <textarea
          placeholder="Answer"
          className="border p-2 w-full mb-4"
          value={newFaq.answer}
          onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
        />
        <button
          onClick={handleCreateOrUpdateFAQ}
          className={`${
            isCreating ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
          } text-white p-2 rounded hover:bg-blue-600`}
          disabled={isCreating} // Disable while mutating
        >
          {isEditing ? "Save Changes" : "Create FAQ"}
        </button>
      </div>

      {/* Existing FAQs */}
      <div className="faq-list space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={faq._id}
            className="faq-card p-6 bg-gray-600 shadow-lg rounded-lg border"
          >
            <div className="faq-question flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {faq.question}
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setEditingIndex(index);
                    setIsEditing(true);
                    setNewFaq({ question: faq.question, answer: faq.answer });
                  }}
                  className="bg-blue-500 text-white rounded-xl p-2 hover:bg-blue-600 focus:outline-none transition duration-300"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDeleteFAQ(faq._id)}
                  className="bg-red-500 text-white rounded-xl p-2 hover:bg-red-600 focus:outline-none transition duration-300"
                >
                  <Trash />
                </button>
              </div>
            </div>

            {/* Display FAQ answer */}
            {!isEditing || editingIndex !== index ? (
              <p className="faq-answer mt-4 text-gray-300">{faq.answer}</p>
            ) : (
              <div className="mt-4">
                <input
                  type="text"
                  className="border p-2 w-full mb-2"
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, question: e.target.value })
                  }
                />
                <textarea
                  className="border p-2 w-full mb-2"
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, answer: e.target.value })
                  }
                />
                <button
                  onClick={handleCreateOrUpdateFAQ}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 ml-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAdmin;
