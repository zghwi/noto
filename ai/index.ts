import Gemini from "./client";

(async () => {
    
    const gemini = new Gemini();
    const test = await gemini.test(5);

    console.log(test);
})();