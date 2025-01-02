import React, { useEffect, useRef, useState } from "react";
import { Button, Select, Slider, Spin } from "antd";
const { Option } = Select;
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { useLocation, useOutletContext } from "react-router-dom";
import { LuSkipBack, LuSkipForward } from "react-icons/lu";
import { _getBookContentBypage } from "../api";
import Loading from "../../../components/Loading";
import debounce from "lodash/debounce";
import { _createHistory } from "../api";

const AudioViewer = () => {
  const location = useLocation();
  const book = location.state.book;
  const page = location.state.page;
  console.log(page);
  const debouncedSave = debounce(async (cPage) => {
    console.log("current page", cPage);
    try {
      const history = {
        book: book._id,
        page: cPage,
      };
      const response1 = await _createHistory(history);
      console.log("đã save");
    } catch (error) {
      console.log(error);
    }
  }, 2000);

  const pageRef = useRef(page);
  const [sentences, setSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const rateRef = useRef(1);
  const voice = useRef("Vietnamese Female");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const sentenceRefs = useRef([]);
  const { cPage, setCPage } = useOutletContext();

  useEffect(() => {
    pageRef.current = page;
    fetchContent();
    return () => {
      window.responsiveVoice.cancel(); // Stop voice when leaving the page
    };
  }, [page]);
  useEffect(() => {
    // Start speaking when sentences change (new page loaded)
    if (sentences.length > 0 && !isPaused) {
      start();
    }
  }, [sentences]);
  //  useEffect(() => {

  //  }, [page]);
  useEffect(() => {
    // Cuộn đến câu hiện tại khi chỉ số câu thay đổi
    if (sentenceRefs.current[currentSentenceIndex]) {
      sentenceRefs.current[currentSentenceIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSentenceIndex]);
  function splitIntoSentences(content) {
    const contentWithoutFirstLine = content.split("\n").slice(1);
    return contentWithoutFirstLine.filter((sentence) => sentence.trim() !== "");
  }

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await _getBookContentBypage(book._id, pageRef.current);
      pageRef.current = response.data.content.page;
      debouncedSave(pageRef.current - 2);
      setCPage(pageRef.current - 2);
      const temp = splitIntoSentences(response.data.content.content);
      // for (let i = 0; i < temp.length; i++) {
      //   console.log("Đang đọc câu", i);
      //   window.responsiveVoice.speak(temp[i], voice.current, {
      //     rate: rateRef.current,
      //     volume: 0,
      //     onend: () => {
      //       console.log("Đã đọc câu", i);
      //     },
      //   });
      // }
      console.log("Trang:", pageRef.current, "Nội dung:", temp.length);
      if (temp.length === 0 && pageRef.current > 1) {
        console.log("Trang này trống, chuyển sang trang tiếp theo");
        await nextPage();
      } else {
        setCurrentSentenceIndex(0);
        setSentences(temp);
        sentenceRefs.current = Array(temp.length)
          .fill()
          .map((_, i) => React.createRef()); // Tạo ref cho từng câu
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = async () => {
    pageRef.current += 1;
    await fetchContent();
  };

  const previousPage = async () => {
    if (pageRef.current > 1) {
      pageRef.current -= 1;
      await fetchContent();
    }
  };
  const renderItem = (item, index) => {
    return (
      <p
        key={index}
        ref={(el) => (sentenceRefs.current[index] = el)} // Gán ref cho từng câu
        className={`sentence my-2 text-lg leading-6 ${
          currentSentenceIndex === index ? "bg-yellow-200" : ""
        }`}
      >
        {item}
      </p>
    );
  };
  const speakSentence = (index) => {
    if (index >= sentences.length) {
      nextPage(); // Move to the next page if the current page is done
      return;
    }
    try {
      window.responsiveVoice.speak(sentences[index], voice.current, {
        rate: rateRef.current,
        onend: () => {
          setCurrentSentenceIndex(index + 1);
          speakSentence(index + 1); // Speak the next sentence
        },
      });
    } catch (error) {
      window.responsiveVoice.speak(sentences[index], voice.current, {
        rate: rateRef.current,
        onend: () => {
          setCurrentSentenceIndex(index + 1);
          speakSentence(index + 1); // Speak the next sentence
        },
      });
    }
  };

  const start = () => {
    setIsPaused(false); // Reset pause state
    speakSentence(currentSentenceIndex);
  };
  const pause = () => {
    window.responsiveVoice.cancel(); // Stop the current voice
    setIsPaused(true); // Set pause state to true
  };
  const togglePlayPause = () => {
    if (!isPaused) {
      pause();
    } else {
      start();
    }
  };
  const nextSentence = () => {
    setIsPaused(false);
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      window.responsiveVoice.cancel(); // Stop current voice
      speakSentence(currentSentenceIndex + 1); // Speak the next sentence
    } else {
      nextPage(); // Go to next page if at the end of the current sentences
    }
  };

  const previousSentence = () => {
    setIsPaused(false);
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      window.responsiveVoice.cancel(); // Stop current voice
      speakSentence(currentSentenceIndex - 1); // Speak the previous sentence
    } else {
      previousPage(); // Go to the previous page if at the beginning of current sentences
    }
  };
  // Function to handle voice change
  const handleVoiceChange = (value) => {
    voice.current = value;
  };
  const handleSpeedChange = (value) => {
    rateRef.current = value;
  };

  return (
    <div className="flex flex-col py-2">
      <div className="grid grid-cols-3 items-center p-4 bg-blue-100  rounded-lg shadow-md border border-gray-200 mb-2">
        {" "}
        {/* Flex column cho nút dọc */}
        <Select
          defaultValue={voice.current}
          className="w-48 rounded-md border border-gray-300"
          onChange={handleVoiceChange}
        >
          {window.responsiveVoice.getVoices().map((v, index) => (
            <Option key={index} value={v.name}>
              {v.name}
            </Option>
          ))}
        </Select>
        <div className="w-48">
          <p className="text-center text-sm font-medium text-gray-700">
            Tốc độ đọc
          </p>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            defaultValue={rateRef.current}
            onChange={handleSpeedChange}
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={previousPage}
            className="mb-2"
            disabled={currentSentenceIndex === 0 && pageRef.current === 1}
          >
            <GrChapterPrevious />
          </Button>
          <Button
            onClick={previousSentence}
            className="mb-2"
            disabled={currentSentenceIndex === 0 && pageRef.current === 1}
          >
            <LuSkipBack />
          </Button>
          <Button onClick={togglePlayPause} className="mb-2">
            {!isPaused ? <CiPause1 /> : <CiPlay1 />}
          </Button>
          <Button
            onClick={nextSentence}
            className="mb-2"
            disabled={
              currentSentenceIndex === sentences.length - 1 &&
              pageRef.current === 1
            }
          >
            <LuSkipForward />
          </Button>
          <Button
            onClick={nextPage}
            className="mb-2"
            disabled={
              currentSentenceIndex === sentences.length - 1 &&
              pageRef.current === 1
            }
          >
            <GrChapterNext />
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex-grow mx-auto w-full bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <div className="book-page max-h-[80vh] overflow-y-auto ">
            {sentences.map((item, index) => renderItem(item, index))}
          </div>
        </div>
      )}
      {/* Cột bên phải chứa các nút */}
    </div>
  );
};

export default AudioViewer;
