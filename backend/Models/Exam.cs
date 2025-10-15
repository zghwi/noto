public class Exam
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FileId { get; set; }
    public int Score { get; set; } = -1;
    public required string Questions { get; set; }
    // [
    //   {
    //      question: string
    //      options: Array<string>
    //      answer_idx: number
    //   }
    // ]
}