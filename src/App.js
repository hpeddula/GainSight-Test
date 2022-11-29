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
  const timer = useCallback(
    (val) => {
      var sec = val;
      var timer = setInterval(function () {
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
    timer(10);
  }, [timer]);
  const fetchCommits = async () => {
    console.log("Fetch Commits");
    try {
      const fetchedCommits = await fetch(
        "https://api.github.com/repos/hpeddula/GainSight-Test/commits",
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer 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`,
          },
        }
      );
      const finalData = await fetchedCommits.json();
      startTransition(() => {
        setCommits(finalData);
      });
    } catch (e) {
      setCommits([]);
    }
  };
  useEffect(() => {
    fetchCommits();
  }, []);
  const getFormattedDate = (date) => {
    const [, month, ,] = new Date(date).toDateString().split(" ");
    const [, , third, fourth] = new Date(date)
      .getFullYear()
      .toString()
      .split("");
    const hour = new Date(date).getHours();
    const min = new Date(date).getMinutes();
    const meridian = hour >= 12 ? "PM" : "AM";
    return `${month} ${third}${fourth}, ${hour}:${min} ${meridian} `;
  };
  return (
    <ErrorBoundary>
      <div className="App">
        <h2>Git Hub Commits</h2>
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
                    <li key={index}>
                      {name} : {message} {getFormattedDate(date)}
                    </li>
                  )
                )
              ) : (
                <h2>Loading....</h2>
              )
            ) : null}
          </ul>
          <button onClick={fetchCommits}>Refresh </button>
          <h4>Timer :{time}</h4>
        </div>
      </div>
    </ErrorBoundary>
  );
}
