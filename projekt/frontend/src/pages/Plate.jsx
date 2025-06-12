import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Button } from "@/components/ui/button";
import { showToast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

export default function Plate() {
  const { nr_tablicy } = useParams();
  const { token, userId, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [context, setContext] = useState("");
  const [isPositive, setIsPositive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContext, setEditContext] = useState("");
  const [editIsPositive, setEditIsPositive] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/comments", {
        params: { nr_tab: nr_tablicy, order: "desc" },
      });
      setComments(data);
      // Usunięto toast "Brak komentarzy"
    } catch (e) {
      showToast("Błąd podczas pobierania komentarzy", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [nr_tablicy]);

  const addComment = async () => {
    if (!context) {
      showToast("Wpisz treść komentarza", "error");
      return;
    }

    if (context.length > 500) {
      showToast("Komentarz nie może mieć więcej niż 500 znaków", "error");
      return;
    }

    if (!token) {
      showToast("Musisz być zalogowany, aby dodać komentarz", "error");
      return;
    }

    try {
      await api.post(
        "/comments",
        {
          nr_tab: nr_tablicy,
          context,
          is_positive: isPositive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Komentarz dodany", "success");
      setContext("");
      fetchComments();
    } catch (e) {
      showToast("Błąd podczas dodawania komentarza", "error");
    }
  };

  const editComment = async (id) => {
    if (!editContext) {
      showToast("Wpisz treść komentarza", "error");
      return;
    }

    if (editContext.length > 500) {
      showToast("Komentarz nie może mieć więcej niż 500 znaków", "error");
      return;
    }

    try {
      await api.put(
        `/comments/${id}`,
        {
          context: editContext,
          is_positive: editIsPositive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Komentarz zaktualizowany", "success");
      setEditingCommentId(null);
      fetchComments();
    } catch (e) {
      showToast("Błąd podczas edycji komentarza", "error");
    }
  };

  const deleteComment = async (id) => {
    if (!token) {
      showToast("Musisz być zalogowany, aby usuwać komentarze", "error");
      return;
    }

    try {
      await api.delete(`/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast("Komentarz usunięty", "success");
      fetchComments();
    } catch (e) {
      if (e.response?.status === 403) {
        showToast("Brak uprawnień do usunięcia komentarza", "error");
      } else {
        showToast("Błąd podczas usuwania komentarza", "error");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Tablica: {nr_tablicy}</h1>

      <div className="mb-6 p-4 border rounded space-y-2">
        <textarea
          placeholder="Napisz komentarz..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div>
          <label className="mr-4">
            <input
              type="radio"
              checked={isPositive}
              onChange={() => setIsPositive(true)}
            />
            <span className="ml-2 text-green-600">Pozytywny</span>
          </label>
          <label>
            <input
              type="radio"
              checked={!isPositive}
              onChange={() => setIsPositive(false)}
            />
            <span className="ml-2 text-red-600">Negatywny</span>
          </label>
        </div>
        <Button onClick={addComment}>Dodaj komentarz</Button>
      </div>

      <div className="p-4 border rounded min-h-[100px]">
        {loading || comments.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-center font-medium">
              {loading ? "Ładowanie komentarzy..." : "Brak komentarzy"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => {
              const isAuthor = c.user_id === userId;
              const canEditOrDelete = isAdmin || isAuthor;

              return (
                <div
                  key={c.id}
                  className={`p-3 rounded flex flex-col gap-2 ${
                    c.is_positive ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {editingCommentId === c.id ? (
                    <>
                      <textarea
                        value={editContext}
                        onChange={(e) => setEditContext(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <div>
                        <label className="mr-4">
                          <input
                            type="radio"
                            checked={editIsPositive}
                            onChange={() => setEditIsPositive(true)}
                          />
                          <span className="ml-2 text-green-600">Pozytywny</span>
                        </label>
                        <label>
                          <input
                            type="radio"
                            checked={!editIsPositive}
                            onChange={() => setEditIsPositive(false)}
                          />
                          <span className="ml-2 text-red-600">Negatywny</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => editComment(c.id)}>
                          Zapisz
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Anuluj
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>{c.context}</p>
                      <small className="opacity-70 text-sm">
                        {new Date(c.created_at).toLocaleString("pl-PL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                      {canEditOrDelete && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditContext(c.context);
                              setEditIsPositive(c.is_positive);
                              setEditingCommentId(c.id);
                            }}
                          >
                            Edytuj
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteComment(c.id)}
                          >
                            Usuń
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
