import Gemini from "./client";

(async () => {
    
    const gemini = new Gemini();
    const test = await gemini.test(15);

    console.log(test);
})();