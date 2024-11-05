'use client';
import { useEffect, useState } from "react";
import { auth } from "../firebase/authenciation";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
//import Footer from "../Component/footer";
// import TopNav from "../Component/header";
import "../scss/history.scss";
import "../scss/subnav.scss";

export default function History() {
  const [challengeData, setChallengeData] = useState([]);
  const [practicesData, setPracticesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const firestore = getFirestore();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User is signed in:", user);
        const userId = user.uid;
        console.log("User ID:", userId);

        // Define the paths to the 'challenge' and 'practices' collections
        const challengeCollection = collection(firestore, 'user_history', userId, 'challenge');
        const practicesCollection = collection(firestore, 'user_history', userId, 'practices');
        console.log("Challenge Collection Path:", challengeCollection.path);
        console.log("Practices Collection Path:", practicesCollection.path);

        try {
          // Set up snapshot listener for 'challenge' collection
          const unsubscribeChallenge = onSnapshot(challengeCollection, (snapshot) => {
            if (snapshot.empty) {
              console.log("No challenge history found for this user.");
              setChallengeData([]);
            } else {
              const fetchedChallenges = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log("Fetched challenge history from Firestore:", fetchedChallenges);
              setChallengeData(fetchedChallenges);
              
            }
          }, (error) => {
            console.error("Error fetching challenge history:", error);
            setError("Error fetching challenge history.");
          });

          // Set up snapshot listener for 'practices' collection
          const unsubscribePractices = onSnapshot(practicesCollection, (snapshot) => {
            if (snapshot.empty) {
              console.log("No practices history found for this user.");
              setPracticesData([]);
            } else {
              const fetchedPractices = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log("Fetched practices history from Firestore:", fetchedPractices);
              setPracticesData(fetchedPractices);
              console.log(fetchedPractices);
            }
          }, (error) => {
            console.error("Error fetching practices history:", error);
            setError("Error fetching practices history.");
          });

          // Stop loading after setting up listeners
          setIsLoading(false);

          // Cleanup snapshot listeners on unmount or auth change
          return () => {
            unsubscribeChallenge();
            unsubscribePractices();
          };
        } catch (err) {
          console.error("Error setting up snapshot listeners:", err);
          setError("Error setting up data listeners.");
          setIsLoading(false);
        }
      } else {
        console.log("No user is signed in.");
        setChallengeData([]);
        setPracticesData([]);
        setIsLoading(false);
      }
    });

    // Scroll progress bar handler
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = Math.round((scrollTop * 100) / calcHeight);
      setScrollProgress(progress);
      console.log("Scroll Progress:", progress);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial calculation
    handleScroll();

    // Cleanup scroll event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribeAuth(); // Cleanup auth listener
    };
  }, [firestore]);

  // Function to combine and standardize question data
  const combineQuestions = (data) => {
    const combinedQuestions = [];

    // Combine originalQuestions and questions arrays
    if (data.originalQuestions && Array.isArray(data.originalQuestions)) {
      data.originalQuestions.forEach(q => {
        combinedQuestions.push({
          question: q.question || "No question provided.",
          correctAnswer: q.correctAnswer || "No answer provided.",
          userAnswer:q.userAnswer || "Skipped",
          source: q.source || q.sources  || "Unknown Source",
        });
      });
    }

    if (data.questions && Array.isArray(data.questions)) {
      data.questions.forEach(q => {
        combinedQuestions.push({
          question: q.question || q.Q || "No question provided.",
          correctAnswer: q.correctAnswer || q.answer || "No answer provided.",
          userAnswer:q.userAnswer || "Skipped",
          source: q.source || q.sources  || "Unknown Source",
        });
      });
    }

    return combinedQuestions;
  };

  const handleModalToggle = (data) => {
    console.log("Modal toggle clicked with data:", data);
    const combinedQuestions = combineQuestions(data);
    setSelectedData({ ...data, combinedQuestions });
    setIsModalOpen(!isModalOpen);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("Scrolled to top");
  };

  return (
    <>
      {/* <TopNav/> */}
      <div
        id="progress"
        style={{ display: scrollProgress > 10 ? "grid" : "none" }} // Adjust threshold as needed
      >
        <span id="progress-value" onClick={handleScrollToTop}>
          <i className="fa-solid fa-arrow-up" />
        </span>
      </div>

      <main className="article">
        {isLoading ? (
          <p>Loading your history...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            {/* Challenge History Section */}
            <section>
              <h2 class="title">Challenge History</h2>
              {challengeData.length === 0 ? (
                <p>You haven't completed any challenges yet.</p>
              ) : (
                challengeData.map((data) => (
                  <div
                    key={data.id}
                    className="vocabulary show-modal"
                    onClick={() => handleModalToggle(data)}
                  >
                    <div className="vocabulary-word20">
                      <div className="title">
                      {data.id.replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="word">
                        <i className="fa-solid fa-star"></i> Score Achieved: {data.score}
                      </div>
                      <div className="word-set">
                        <i className="fa-solid fa-fire"></i> Highest Streak: {data.highestStreak}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Practices History Section */}
            <section>
              <h2 class="title">Practices History</h2>
              {practicesData.length === 0 ? (
                <p>You haven't completed any practices yet.</p>
              ) : (
                practicesData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((data,index) => (
                  <div
                    key={data.id}
                    className="vocabulary show-modal"
                    onClick={() => handleModalToggle(data)}
                  >
                    <div className="vocabulary-word20">
                    <div className="title">
                       {index + 1}. {data.type}
                      </div>
                      <div className="word">
                        <i className="fa-solid fa-star"></i> Score Achieved: {data.score}
                      </div>
                      <div className="word-set">
                        <i className="fa-solid fa-fire"></i> Highest Streak: {data.highestStreak}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </main>

      {/* Modal for displaying questions */}
      {isModalOpen && selectedData && (
        <div className="word-box-overlay overlay">
          <div className="modal20">
            <button className="close-modal" onClick={() => setIsModalOpen(false)} aria-label="Close Modal">
              ×
            </button>
            {selectedData.combinedQuestions && selectedData.combinedQuestions.length > 0 ? (
              selectedData.combinedQuestions.map((question, idx) => (
                <div key={idx} className="question_box">
                  <h1>Question</h1>
                  <div className="question">
        {question.question.startsWith('http') && (
          question.question.endsWith('.jpg') || 
          question.question.endsWith('.jpeg') || 
          question.question.endsWith('.png') || 
          question.question.endsWith('.gif') ? (
            <img src={question.question} alt="Question related" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: question.question }} />
          )
        )}
        {!question.question.startsWith('http') && (
          <div dangerouslySetInnerHTML={{ __html: question.question.replace(/<img[^>]*>/g, '') }} />
        )}
      </div>
                  <div className="Answers">
                  <div className="defaultAnswer" style={{display:question.source!="Drag and Drop" ? "":"none"}}>
                  <h2>Your Answer</h2>
                  <div className="dapan" style={{backgroundColor:question.userAnswer != question.correctAnswer ? "red" : "#00a900" }}>{question.userAnswer}</div>
                  </div>
                  <div className="defaultAnswer">
                  <h2>Correct Answer</h2>
                  <div className="dapan">{question.correctAnswer}</div>
                  </div>
                  </div>
                  <p><strong>Source:</strong> {question.source}</p>
                </div>
              ))
            ) : (
              <p>No questions available.</p>
            )}
          </div>
        </div>
      )}

      {/* <Footer /> */}
    </>
  );
}
