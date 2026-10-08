import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://jsonplaceholder.typicode.com";

function App() {
  const [page, setPage] = useState("home");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    title: "",
    body: ""
  });

  // -----------------------------
  // GET USERS
  // -----------------------------

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API}/users`);

      setUsers(response.data);
    } catch (err) {
      setError("Unable to load developers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // -----------------------------
  // VIEW PROFILE
  // -----------------------------

  const openProfile = async (user) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/posts?userId=${user.id}`
      );

      setSelectedUser(user);
      setPosts(response.data);
      setPage("profile");
    } catch (err) {
      setError("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // SEARCH
  // -----------------------------

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(query) ||
      user.company.name.toLowerCase().includes(query)
    );
  });

  // -----------------------------
  // LOGIN
  // -----------------------------

  const login = () => {
    setLoggedIn(true);
    setPage("home");
  };

  const logout = () => {
    setLoggedIn(false);
    setPage("home");
  };

  // -----------------------------
  // FORM
  // -----------------------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const publishPost = async (e) => {
    e.preventDefault();

    if (form.title.length < 5) {
      alert("Title must contain at least 5 characters.");
      return;
    }

    if (form.title.length > 80) {
      alert("Title cannot exceed 80 characters.");
      return;
    }

    if (form.body.length < 20) {
      alert("Body must contain at least 20 characters.");
      return;
    }

    try {
      const response = await axios.post(`${API}/posts`, {
        title: form.title,
        body: form.body,
        userId: Number(form.userId)
      });

      if (response.status === 201) {
        alert("🎉 Article published successfully!");

        setForm({
          userId: "",
          title: "",
          body: ""
        });

        setPage("users");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  // -----------------------------
  // NAVBAR
  // -----------------------------

  const Navbar = () => (
    <nav className="navbar">

      <div
        className="logo"
        onClick={() => setPage("home")}
      >
        NEBULA<span>/DEV</span>
      </div>

      <div className="navLinks">

        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={() => setPage("users")}>
          Developers
        </button>

        {loggedIn && (
          <button onClick={() => setPage("publish")}>
            Publish
          </button>
        )}

        {!loggedIn ? (
          <button
            className="loginBtn"
            onClick={() => setPage("login")}
          >
            Login
          </button>
        ) : (
          <button
            className="logoutBtn"
            onClick={logout}
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );

  // -----------------------------
  // HOME
  // -----------------------------

  const Home = () => (
    <div className="home">

      <section className="hero">

        <div className="badge">
          ✦ DEVELOPER INTELLIGENCE NETWORK
        </div>

        <h1>
          Meet the minds
          <br />
          <span>building tomorrow.</span>
        </h1>

        <p>
          Discover developers, explore technical
          publications and connect with people
          building the future of technology.
        </p>

        <div className="heroButtons">

          <button
            className="primaryBtn"
            onClick={() => setPage("users")}
          >
            Explore Developers →
          </button>

          <button
            className="secondaryBtn"
            onClick={() => setPage("login")}
          >
            Join Network
          </button>

        </div>

      </section>

      <section className="stats">

        <div>
          <strong>{users.length}</strong>
          <span>Developers</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Knowledge</span>
        </div>

        <div>
          <strong>API</strong>
          <span>Powered</span>
        </div>

        <div>
          <strong>100%</strong>
          <span>Responsive</span>
        </div>

      </section>

    </div>
  );

  // -----------------------------
  // DEVELOPERS
  // -----------------------------

  const Developers = () => (
    <div className="page">

      <div className="heading">

        <div>
          <small>THE NETWORK</small>

          <h1>Developer Directory</h1>

          <p>
            Find developers and explore what
            they're building.
          </p>
        </div>

        <div className="count">
          {filteredUsers.length} developers
        </div>

      </div>

      <input
        className="search"
        placeholder="🔎 Search developer or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && (
        <div className="loading">
          Loading developers...
        </div>
      )}

      {error && (
        <div className="error">
          ⚠️ {error}
          <button onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      <div className="userGrid">

        {filteredUsers.map((user) => (

          <div
            className="userCard"
            key={user.id}
          >

            <div className="avatar">
              {user.name.charAt(0)}
            </div>

            <h2>{user.name}</h2>

            <p className="username">
              @{user.username}
            </p>

            <p>
              🏢 {user.company.name}
            </p>

            <p>
              📍 {user.address.city}
            </p>

            <button
              className="profileBtn"
              onClick={() => openProfile(user)}
            >
              View Profile →
            </button>

          </div>

        ))}

      </div>

    </div>
  );

  // -----------------------------
  // PROFILE
  // -----------------------------

  const Profile = () => (
    <div className="page">

      <button
        className="backBtn"
        onClick={() => setPage("users")}
      >
        ← Back
      </button>

      {selectedUser && (

        <>
          <section className="profile">

            <div className="largeAvatar">
              {selectedUser.name.charAt(0)}
            </div>

            <div>

              <small>DEVELOPER PROFILE</small>

              <h1>
                {selectedUser.name}
              </h1>

              <p>
                @{selectedUser.username}
              </p>

              <p>
                🏢 {selectedUser.company.name}
              </p>

              <p>
                📍 {selectedUser.address.city}
              </p>

              <p>
                ✉️ {selectedUser.email}
              </p>

            </div>

          </section>

          <h2 className="sectionTitle">
            Technical Publications
          </h2>

          <div className="postGrid">

            {posts.map((post) => (

              <article
                className="postCard"
                key={post.id}
              >

                <small>
                  PUBLICATION #{post.id}
                </small>

                <h3>
                  {post.title}
                </h3>

                <p>
                  {post.body}
                </p>

              </article>

            ))}

          </div>

        </>

      )}

    </div>
  );

  // -----------------------------
  // LOGIN
  // -----------------------------

  const Login = () => (
    <div className="auth">

      <div className="loginCard">

        <div className="authLogo">
          N
        </div>

        <small>SECURE ACCESS</small>

        <h1>
          Welcome to Nebula
        </h1>

        <p>
          Sign in to publish technical
          knowledge to the network.
        </p>

        <input
          placeholder="Your name"
        />

        <button
          className="primaryBtn full"
          onClick={login}
        >
          Enter Network →
        </button>

      </div>

    </div>
  );

  // -----------------------------
  // PUBLISH
  // -----------------------------

  const Publish = () => (
    <div className="page">

      <div className="heading">

        <div>
          <small>KNOWLEDGE HUB</small>

          <h1>
            Publish an Article
          </h1>

          <p>
            Share something valuable
            with developers.
          </p>

        </div>

      </div>

      <form
        className="postForm"
        onSubmit={publishPost}
      >

        <label>
          Author
        </label>

        <select
          name="userId"
          value={form.userId}
          onChange={handleChange}
          required
        >

          <option value="">
            Select developer
          </option>

          {users.map((user) => (

            <option
              key={user.id}
              value={user.id}
            >
              {user.name}
            </option>

          ))}

        </select>

        <label>
          Title
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Article title..."
          required
        />

        <div className="character">
          {form.title.length}/80
        </div>

        <label>
          Article Content
        </label>

        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Write your technical article..."
          rows="8"
          required
        />

        <div className="character">
          {form.body.length}/500
        </div>

        <button
          className="primaryBtn"
          type="submit"
        >
          Publish Article →
        </button>

      </form>

    </div>
  );

  // -----------------------------
  // PAGE ROUTER
  // -----------------------------

  return (
    <>
      <Navbar />

      {page === "home" && <Home />}

      {page === "users" && <Developers />}

      {page === "profile" && <Profile />}

      {page === "login" && <Login />}

      {page === "publish" && (
        loggedIn
          ? <Publish />
          : <Login />
      )}
    </>
  );
}

export default App;