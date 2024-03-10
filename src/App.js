import './App.css';
import React,{ useState,useEffect } from 'react';


function App() {
  let [words, setWords] = useState(localStorage.getItem("words")!=null? JSON.parse(localStorage.getItem("words")):(
    [
    ['', '', '','',''],
    ['', '', '','',''],
    ['', '', '','',''],
    ['', '', '','',''],
    ['', '', '','',''],
    ['', '', '','','']
]));
    
    const getWordOfTheDay = async ()=>{
      try {
        var date=new Date();
        if(localStorage.getItem("date")!=null)
        {
          var date = new Date(JSON.parse(localStorage.getItem("date")))
        }
        else
        {
          localStorage.setItem('date', JSON.stringify(new Date()));
        }
        
        if(date.setHours(0, 0, 0, 0)===new Date().setHours(0, 0, 0, 0) && localStorage.getItem("wordOfDay")!=null)
        {
          
          return JSON.parse(localStorage.getItem("wordOfDay"));
        }
        else
        {
          
          var response = await fetch(`https://random-word-api.herokuapp.com/word?number=1&length=5`);
          var data = await response.json();
          while(!checkWord(data[0]))
          {
            response = await fetch(`https://random-word-api.herokuapp.com/word?number=1&length=5`);
            if(response.ok) 
            {
              data = await response.json();
            }
          }
          
            localStorage.setItem('wordOfDay', JSON.stringify([...data[0]]));
            return [...data[0]];
          }
        }
       
      
        catch (error) {
        return ['t','a','b','l','e'];
      }
    }
    const [wordOfTheDay,SetWordOfTheDay] = useState([]);
    const [col,setCol] = useState(0);
    const [row,setRow] = useState(localStorage.getItem("row")!=null?parseInt(localStorage.getItem("row")):0);
    const [finished,setFinished]=useState(false);
    const [popup,setPopup]=useState(false);
    const handleKeyPress = async (event) => {
      if(row===6)
        return;
      const letterRegex = /^[a-zA-Z]$/;
      if (letterRegex.test(event.key)) {
         if(col<5)
         {
            setWords(prevWords =>{
              const newWord = [...prevWords ];
              newWord[row] = [...newWord[row]];
              newWord[row][col] = event.key; 
              return newWord; 
            });
            setCol(prevCol => prevCol + 1);
              
         }
      }
      else if(event.key === "Backspace")
      {
        if(col>=0)
         {
            setWords(prevWords =>{
              const newWord = [...prevWords ];
              newWord[row] = [...newWord[row]];
              newWord[row][col-1] = ""; 
              return newWord; 
            })
            if(col>0)
              setCol((prevCol) => (prevCol - 1));    
         }
      }
      else if(event.key === "Enter")
      {
          if(words[row][4] !== '')
          {
            const exist = await checkWord(words[row].join(''))
            if(exist)
            {
              localStorage.setItem("words",JSON.stringify(words));
              localStorage.setItem("row",row+1);
              setRow((prev)=>(prev+1));
              setCol(0);
              if(words[row].toString()===wordOfTheDay.toString())
              {
                
                setFinished(true);
                document.removeEventListener('keydown', handleKeyPress);
              }

            }
            else
              alert("word does not exist")
          }
          else
           alert("not enough letters")
      }
    };

    useEffect(()=>{
      const fetchData = async () => {
        try {
         
          const wordOfTheDay = await getWordOfTheDay();
          
          SetWordOfTheDay(wordOfTheDay);
        } catch (error) {
          console.error("Error fetching word of the day:", error);
        }
      };
      fetchData();
      if(row>0 && words[row-1].toString()===wordOfTheDay.toString())
      {
        setFinished(true);
        document.removeEventListener('keydown', handleKeyPress);
      }
    },[])


    useEffect(() => {
      
      if(!finished)
        document.addEventListener('keydown', handleKeyPress);
      if(finished)
      {
        setTimeout(function() {
          setPopup(true)
        }, 5500);
      }
      
      return () => {
          document.removeEventListener('keydown', handleKeyPress);
      };
  }, [words,col,row,popup]);





  
  const handleBoxColor =(i,j)=>{
    if(words[i][j]===wordOfTheDay[j]) return "flipsGreen"+j;
    else if(wordOfTheDay.toString().includes(words[i][j])) return "flipsYellow"+j;
    else return "flipsGris"+j;
  }
  
  const checkWord = async (word) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if(response.ok) 
      {
        const data = await response.json()
        
        if(data[0].word ===word)
        return true;
        else return false;
      }
      else {return false;}
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      
        <div className='header'><h1>Wordle</h1></div>
        {popup && (<React.Fragment> <div className="overlay">
        <div className="popup">
          <h2>Congratulations!</h2>
          <p>Great job!</p>
          <button onClick={()=>(setPopup(false))}>Close</button>
        </div>
      </div></React.Fragment>)}
        <div className='body'>
        <div className={`box ${row>=1 ? handleBoxColor(0,0) :''}`}>{words[0][0]}</div>
        <div className={`box ${row>=1 ? handleBoxColor(0,1) :''}`}>{words[0][1]}</div>
        <div className={`box ${row>=1 ? handleBoxColor(0,2) :''}`}>{words[0][2]}</div>
        <div className={`box ${row>=1 ? handleBoxColor(0,3) :''}`}>{words[0][3]}</div>
        <div className={`box ${row>=1 ? handleBoxColor(0,4) :''}`}>{words[0][4]}</div>

        <div className={`box ${row>=2 ? handleBoxColor(1,0) :''}`}>{words[1][0]}</div>
        <div className={`box ${row>=2 ? handleBoxColor(1,1) :''}`}>{words[1][1]}</div>
        <div className={`box ${row>=2 ? handleBoxColor(1,2) :''}`}>{words[1][2]}</div>
        <div className={`box ${row>=2 ? handleBoxColor(1,3) :''}`}>{words[1][3]}</div>
        <div className={`box ${row>=2 ? handleBoxColor(1,4) :''}`}>{words[1][4]}</div>

        <div className={`box ${row>=3 ? handleBoxColor(2,0) :''}`}>{words[2][0]}</div>
        <div className={`box ${row>=3 ? handleBoxColor(2,1) :''}`}>{words[2][1]}</div>
        <div className={`box ${row>=3 ? handleBoxColor(2,2) :''}`}>{words[2][2]}</div>
        <div className={`box ${row>=3 ? handleBoxColor(2,3) :''}`}>{words[2][3]}</div>
        <div className={`box ${row>=3 ? handleBoxColor(2,4) :''}`}>{words[2][4]}</div>

        <div className={`box ${row>=4 ? handleBoxColor(3,0) :''}`}>{words[3][0]}</div>
        <div className={`box ${row>=4 ? handleBoxColor(3,1) :''}`}>{words[3][1]}</div>
        <div className={`box ${row>=4 ? handleBoxColor(3,2) :''}`}>{words[3][2]}</div>
        <div className={`box ${row>=4 ? handleBoxColor(3,3) :''}`}>{words[3][3]}</div>
        <div className={`box ${row>=4 ? handleBoxColor(3,4) :''}`}>{words[3][4]}</div>

        <div className={`box ${row>=5 ? handleBoxColor(4,0) :''}`}>{words[4][0]}</div>
        <div className={`box ${row>=5 ? handleBoxColor(4,1) :''}`}>{words[4][1]}</div>
        <div className={`box ${row>=5 ? handleBoxColor(4,2) :''}`}>{words[4][2]}</div>
        <div className={`box ${row>=5 ? handleBoxColor(4,3) :''}`}>{words[4][3]}</div>
        <div className={`box ${row>=5 ? handleBoxColor(4,4) :''}`}>{words[4][4]}</div>

        <div className={`box ${row>=6 ? handleBoxColor(5,0) :''}`}>{words[5][0]}</div>
        <div className={`box ${row>=6 ? handleBoxColor(5,1) :''}`}>{words[5][1]}</div>
        <div className={`box ${row>=6 ? handleBoxColor(5,2) :''}`}>{words[5][2]}</div>
        <div className={`box ${row>=6 ? handleBoxColor(5,3) :''}`}>{words[5][3]}</div>
        <div className={`box ${row>=6 ? handleBoxColor(5,4) :''}`}>{words[5][4]}</div>
      </div>
     
      
    </div>
  );
}

export default App;
