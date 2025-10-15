public class CardsPack
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FileId { get; set; }
    public required string Cards { get; set; }
}