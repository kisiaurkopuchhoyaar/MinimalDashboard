

namespace MinimalDashboard.Models
{

    //first layer >select subId, ContentType, subjectName, bookOrder from Subject_BookShopping where isDeleted = 0 order by bookOrder

    // second layer>> select chapterId,subId,chapterName,chapterOrder,HasTopics from chapters_BookShopping where isdeleted=0 order by subId,chapterOrder

    //third layer >>> select topicId,chapterId,topicName,[Order] from Topics_BookShopping where isdeleted = 0 order by chapterId,[Order]

    //final layer >>>> select AutoId, BookCoverNote as BookName,BookTopics as description,imgpath as coverUrl,pdfName as  pdfUrl,topicid,chapterId,subjectId,OrderID as pdforder,ispdf,HtmlContent
    //from Book_MasterDuplicate_APP
    //where show = 'yes' and age_group = '' order by coalesce(topicId, chapterid), OrderID,createddate
    public class DashboardModel
    {
        //how to optimize this model? and use better approach for list or other data structure?
       
        public List<Subject> Subjects { get; set; } = new();
    }

    public class Subject
    {
        public int SubId { get; set; }
        public required string ContentType { get; set; }
        public required string SubjectName { get; set; }
        public int BookOrder { get; set; }
        public  required List<Chapter> Chapters { get; set; } = new();
    }
    public class Chapter
    {
        public int ChapterId { get; set; }
        public int SubId { get; set; }
        public string? ChapterName { get; set; }
        public int ChapterOrder { get; set; }
        public bool HasTopics { get; set; }
        public int pdfCount { get; set; }
        public List<Topic>? Topics { get; set; }= new();
        public List<Book>? Books { get; set; } = new();
    }
    public class Topic
    {
        public int TopicId { get; set; }
        public int ChapterId { get; set; }
        public string? TopicName { get; set; }
        public int Order { get; set; }
        public int PdfCount { get; set; }
        public required List<Book> Books { get; set; } = new();
    }
    public class Book
    {
        public int AutoId { get; set; }
        public string? BookName { get; set; }
        public string? Description { get; set; }
        public string? CoverUrl { get; set; }
        public string? PdfUrl { get; set; }
        public int? TopicId { get; set; }
        public int ChapterId { get; set; }
        public int SubjectId { get; set; }
        public int? PdfOrder { get; set; }
        public bool IsPdf { get; set; }
        public string? HtmlContent { get; set; }
    }
}
