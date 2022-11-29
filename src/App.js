import "./styles.css";
import {
  useEffect,
  useState,
  Suspense,
  Component,
  useTransition,
  useCallback,
} from "react";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch() {
    console.log("Inside component Did catch");
    this.setState({
      hasError: true,
    });
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <div>Loading Failed{error}</div>;
    } else {
      return this.props.children;
    }
  }
}
export default function App() {
  const [commits, setCommits] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [time, setTimer] = useState(30);
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenMessage, setAccessTokenMessage] = useState("");
  const fetchCommits = async () => {
    console.log("Fetch Commits");
    const token = sessionStorage.getItem("token");
    console.log(token);
    if (token) {
      try {
        const fetchedCommits = await fetch(
          "https://api.github.com/repos/hpeddula/GainSight-Test/commits",
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const finalData = await fetchedCommits.json();
        startTransition(() => {
          setCommits(finalData);
        });
        setAccessTokenMessage("");
      } catch (e) {
        setCommits([]);
      }
    } else {
      setAccessTokenMessage("Enter Access Token to get Git Commits");
    }
  };
  const timer = useCallback(
    (val) => {
      var sec = val;
      var timer = setInterval(() => {
        setTimer(sec);
        sec--;
        if (sec < 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
    [setTimer]
  );
  useEffect(() => {
    if (accessToken) timer(30);
  }, [timer, accessToken]);
  useEffect(() => {
    if (time === 0) {
      fetchCommits();
      timer(30);
    }
  }, [time, timer]);

  useEffect(() => {
    fetchCommits();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchCommits();
    }
  }, [accessToken]);
  const getFormattedDate = (date) => {
    const [, month, ,] = new Date(date).toDateString().split(" ");
    const [, , third, fourth] = new Date(date)
      .getFullYear()
      .toString()
      .split("");
    const hour = new Date(date).getHours();
    const min =
      new Date(date).getMinutes().toString().length === 1
        ? `0${new Date(date).getMinutes().toString()}`
        : new Date(date).getMinutes();
    const meridian = hour >= 12 ? "PM" : "AM";
    return `${month} ${third}${fourth}, ${hour}:${min} ${meridian} `;
  };
  const handleAccessToken = (token) => {
    setAccessToken(token);
    sessionStorage.setItem("token", token);
  };
  return (
    <ErrorBoundary>
      <div className="App">
        {accessTokenMessage ? (
          <div className="infoBanner">
            <marquee direction="right">
              <h4>{accessTokenMessage}</h4>
            </marquee>
          </div>
        ) : null}
        <div className="container">
          <h2>Git Hub Commits</h2>
          <h4>Timer :{time}</h4>
          <input
            type="text"
            onBlur={(e) => handleAccessToken(e.target.value)}
          />
          <button onClick={fetchCommits}>Refresh </button>
        </div>
        <div className="container">
          <ul>
            {commits.length ? (
              !isPending ? (
                commits?.map(
                  (
                    {
                      commit: {
                        author: { name, date },
                        message,
                      },
                    },
                    index
                  ) => (
                    <div key={index} className="card">
                      <h5>{message} </h5>
                      <h6>
                        {getFormattedDate(date)} by {name}
                      </h6>
                    </div>
                  )
                )
              ) : (
                <h2>Loading....</h2>
              )
            ) : null}
          </ul>
        </div>
      </div>
    </ErrorBoundary>
  );
}
