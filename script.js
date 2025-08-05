let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let video = document.querySelector("#video");

let maleVoice = null;

// Load and lock voice as early as possible
function loadVoices() {
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;

    maleVoice = voices.find(voice =>
        voice.lang.startsWith("en") && (
            voice.name.toLowerCase().includes("male") ||
            voice.name.toLowerCase().includes("john") ||
            voice.name.toLowerCase().includes("david") ||
            voice.name.toLowerCase().includes("matthew") ||
            voice.name.toLowerCase().includes("english us")
        )
    );
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices(); // Call immediately as well

function speak(text) {
    speechSynthesis.cancel();
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-US";

    if (maleVoice) {
        text_speak.voice = maleVoice;
    }

    speechSynthesis.speak(text_speak);
}

function wishMe() {
    let hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon Sir");
    } else if (hours >= 16 && hours < 20) {
        speak("Good Evening Sir");
    } else {
        speak("Good Night Sir");
    }
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
    let transcript = event.results[event.resultIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase().trim());
};

recognition.onerror = (event) => {
    speak("Sorry, I couldn't understand. Please try again.");
    console.error("Recognition error:", event);
    btn.style.display = "flex";
    video.style.display = "none";
};

btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = "none";
    video.style.display = "block";
});

function takeCommand(message) {
    btn.style.display = "flex";
    video.style.display = "none";

    const greetTriggers = ["hello", "hey", "hi"];
const nameTriggers = ["gyani", "gyaani"];

   if (
    greetTriggers.some(g => message.includes(g)) &&
    nameTriggers.some(n => message.includes(n))) {
    speak("Hello sir, what can I help you?");
    return;
}
    else if (message.includes("who are you")) {
        speak("I am Gyani, a virtual assistant created by Sahil sir.");
    }
     else if (message.includes("open youtube")) {
        speak("Opening YouTube");
        window.open("https://www.youtube.com", "_blank");
    }
     else if (message.includes("open google")) {
        speak("Opening Google");
        window.open("https://www.google.com", "_blank");
    } 
    else if (message.includes("open chatgpt")) {
        speak("Opening ChatGPT");
        window.open("https://chatgpt.com", "_blank");
    } 
    else if (message.includes("open in cable")) {
        speak("Opening In Cable");
        window.open("https://lcoportalv2.incablenet.net", "_blank");
    } else if (message.includes("open ai")) {
        speak("Opening AI");
        window.open("https://chatgpt.com", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram");
        window.open("https://www.instagram.com", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening Calculator");
        window.open("calculator://");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp");
        window.open("whatsapp://");
    } else if (message.startsWith("play ")) {
        let songName = message.replace("play ", "").trim();
        if (songName) {
            speak(`Playing ${songName} on Spotify`);
            window.open(`https://open.spotify.com/search/${encodeURIComponent(songName)}`, "_blank");
        } else {
            speak("Please say the song name after play.");
        }
    } else if (message.includes("open spotify")) {
        speak("Opening Spotify");
        window.open("spotify://");
    } else {
        // Fallback to Wikipedia
        let query = message
            .replace("gyani", "")
            .replace("gyaani", "")
            .replace("who is", "")
            .replace("tell me about", "")
            .replace("tell me something about", "")
            .replace("what is", "")
            .replace("do you know about", "")
            .trim();

        if (!query) {
            speak("I didn't catch the topic. Please try again.");
            return;
        }

        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.extract) {
                    if (data.thumbnail?.source) {
                        content.innerHTML = `<img src="${data.thumbnail.source}" style="max-width:300px; border-radius:10px; margin-bottom:10px;">`;
                    }
                    speak(data.extract);

                    let i = 0;
                    const text = data.extract;
                    const typedDiv = document.createElement("div");
                    typedDiv.id = "typedText";
                    content.appendChild(typedDiv);

                    const typing = setInterval(() => {
                        if (i < text.length) {
                            typedDiv.innerHTML += text.charAt(i);
                            i++;
                        } else {
                            clearInterval(typing);
                            const checkSpeechEnd = setInterval(() => {
                                if (!speechSynthesis.speaking) {
                                    document.getElementById("micContainer")?.appendChild(btn);
                                    btn.style.display = "flex";
                                    clearInterval(checkSpeechEnd);
                                }
                            }, 100);
                        }
                    }, 45);
                } else {
                    speak("Sorry, I couldn't find anything about " + query);
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
                    btn.style.display = "flex";
                }
            })
            .catch(error => {
                speak("There was an error fetching the data.");
                console.error("Wikipedia fetch error:", error);
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
                btn.style.display = "flex";
            });
    }
}
