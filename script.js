 const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const messageInput = document.getElementById("message-input");
    const sendChatBtn = document.getElementById("send-btn");
    const suggestionContainer = document.querySelector(".suggestion-container");

    // Array of science facts
  const scienceFacts = [
    "Did you know? The Sun accounts for 99.86% of the mass in the Solar System! ☀️",
    "Fact: Jupiter has 79 moons, the most of any planet in our Solar System. 🪐",
    "Amazing! A day on Venus is longer than a year on Venus. 🌟",
    "Did you know? Light from the Sun takes 8 minutes and 20 seconds to reach Earth. 🌞",
    "Fact: There are more stars in the universe than grains of sand on all the Earth’s beaches. 🌌",
    "Did you know? The largest volcano in the Solar System is on Mars, called Olympus Mons. 🔥",
    "Amazing! The Milky Way galaxy is approximately 100,000 light-years in diameter. 🌠",
    "Fact: Saturn’s rings are made mostly of ice particles, with some rock debris and dust. 💍",
    "Did you know? A neutron star is so dense that a sugar-cube-sized amount of material from one would weigh about a billion tons. 🌌",
    "Amazing! There are black holes in space that are millions of times more massive than our Sun. 🕳️",
    "Did you know? The coldest place in the universe is the Boomerang Nebula, with a temperature of -458°F (-272°C). ❄️",
    "Fact: There are more atoms in a single teaspoon of water than there are teaspoons of water in all the oceans. 🌊",
    "Amazing! A day on Mercury lasts about 59 Earth days. ☀️",
    "Did you know? The total weight of all the ants on Earth is about the same as the total weight of all the humans on Earth. 🐜",
    "Fact: The Andromeda Galaxy is on a collision course with the Milky Way and will merge with it in about 4.5 billion years. 🌌",
    "Amazing! If you could drive a car to the Sun at 60 mph, it would take over 6 months to get there. 🚗🌞",
    "Did you know? One spoonful of a neutron star would weigh about 6 billion tons. 🌟",
    "Fact: The largest known star, UY Scuti, is about 1,700 times the diameter of the Sun. 🌟",
    "Amazing! There are more possible iterations of a game of chess than there are atoms in the observable universe. ♟️",
    "Did you know? The Great Red Spot on Jupiter is a giant storm that has been raging for at least 400 years. 🌪️",
    "Fact: The surface of Venus is hot enough to melt lead, with temperatures around 900°F (475°C). 🔥",
    "Amazing! The observable universe is about 93 billion light-years in diameter. 🌌",
    "Did you know? The Earth’s core is as hot as the surface of the Sun, around 10,800°F (6,000°C). 🌋",
    "Fact: If you could walk at a pace of 1 mile per hour, it would take you about 4.5 years to walk around the Earth’s equator. 🌍",
    "Amazing! The largest known galaxy, IC 1101, is about 6 million light-years in diameter. 🌠",
    "Did you know? A day on the planet Neptune lasts about 16 hours and 6 minutes. 🌌",
    "Fact: A single bolt of lightning contains enough energy to cook 100,000 slices of toast. ⚡🍞",
    "Amazing! The Moon is moving away from Earth at a rate of about 1.5 inches (3.8 cm) per year. 🌕",
    "Did you know? The longest possible total solar eclipse can last about 7 minutes and 31 seconds. 🌒",
    "Fact: The universe is about 13.8 billion years old, according to the most recent measurements. 🌌",
    "Amazing! The light from the farthest known galaxy takes about 13.4 billion years to reach us. 🌠",
    "Did you know? The atmosphere of Saturn is made mostly of hydrogen and helium, with a lot of methane. 🪐",
    "Fact: The Voyager 1 spacecraft, launched in 1977, is the farthest human-made object from Earth. 🚀",
    "Amazing! Honey never spoils and can last for thousands of years without going bad. 🍯",
    "Did you know? The Earth's magnetic field protects us from harmful solar radiation and cosmic rays. 🛰️",
    "Fact: A group of flamingos is called a 'flamboyance.' 🦩",
    "Amazing! An octopus has three hearts and blue blood. 🐙",
    "Did you know? The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion. 🗼",
    "Fact: The largest living structure on Earth is the Great Barrier Reef, which stretches over 2,300 kilometers. 🐠"
];


    const createChatLi = (message, className, isSuggestion = false) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = '';

        if (isSuggestion && className === "incoming") {
            chatContent = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="suggestion-container">`;
            message.forEach(suggestion => {
                chatContent += `<button class="suggestion-btn">${suggestion}</button>`;
            });
            chatContent += `</div>`;
        } else {
            chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
        }

        chatLi.innerHTML = chatContent;
        return chatLi;
    };

    const createTypingIndicator = () => {
        const typingLi = document.createElement("li");
        typingLi.classList.add("chat", "incoming");
        typingLi.innerHTML = `
            <span class="material-symbols-outlined">smart_toy</span>
            <div class="typing-indicator"></div>
            <div class="typing-indicator"></div>
            <div class="typing-indicator"></div>
        `;
        return typingLi;
    };

    const sendMessageToFlask = (message) => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message })
        };

        return fetch('http://127.0.0.1:5000/api/generate-response', requestOptions)
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    };

    const handleChat = (message = null) => {
        const userMessage = message || messageInput.value.trim();
        if (!userMessage) return;

        messageInput.value = "";

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Show typing indicator before the bot replies
        const typingIndicator = createTypingIndicator();
        chatbox.appendChild(typingIndicator);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        sendMessageToFlask(userMessage).then(data => {
            // Remove typing indicator after a delay
            setTimeout(() => {
                chatbox.removeChild(typingIndicator);

                if (data && data.reply) {
                    chatbox.appendChild(createChatLi(data.reply, "incoming"));

                    if (data.buttons) {
                        const suggestions = data.buttons.map(button => button.text);
                        chatbox.appendChild(createChatLi(suggestions, "incoming", true));
                    }
                } else {
                    chatbox.appendChild(createChatLi("Failed to get response from the server. Please try again later.", "incoming"));
                }

                chatbox.scrollTo(0, chatbox.scrollHeight);
            }, 2000); // 2-second delay for the typing effect
        }).catch(() => {
            chatbox.removeChild(typingIndicator);
            chatbox.appendChild(createChatLi("Failed to connect to the server. Please check your internet connection.", "incoming"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
    };

    document.addEventListener("DOMContentLoaded", () => {


        // Display a random science fact after a delay
        setTimeout(() => {
//            const randomFact = scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
            chatbox.appendChild(createChatLi("Welcome to our chatbot! How can I assist you today?<br><br>", "incoming"));
            const suggestions = ["Welcome To GEHU ", "Why GEHU", "Contact us"];
            chatbox.appendChild(createChatLi(suggestions, "incoming", true));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }, 20); // 2-second delay

        messageInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
            }
        });
    });

    sendChatBtn.addEventListener("click", () => handleChat());

    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

    chatbox.addEventListener("click", (e) => {
        if (e.target.classList.contains("suggestion-btn")) {
            handleChat(e.target.textContent);
        }
    });