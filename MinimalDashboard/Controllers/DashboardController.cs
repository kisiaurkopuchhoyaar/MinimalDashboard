// BACKUP: This file was saved after a merge conflict or before a risky operation.
// If you need to restore, use this version.

using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

using MinimalDashboard.Models;
using System;
using System.Threading.Tasks;


namespace MinimalDashboard.Controllers
{
    public class DashboardController : Controller
    {
        //use connection string from program.cs 

        private readonly string _connectionString;

        public DashboardController(IConfiguration cfg)
        {

            _connectionString = cfg.GetConnectionString("DefaultConnection")!;
        }
        //keep all list globally in this controller without heirarchy , so that we can access it in all actions
        //and use it in all actions
        private List<Subject> _subjects = new List<Subject>();
        private List<Chapter> _chapters = new List<Chapter>();
        private List<Topic> _topics = new List<Topic>();
        private List<Book> _books = new List<Book>();






        //first layer >select subId, ContentType, subjectName, bookOrder from Subject_BookShopping where isDeleted = 0 order by bookOrder

        // second layer>> select chapterId,subId,chapterName,chapterOrder,HasTopics from chapters_BookShopping where isdeleted=0 order by subId,chapterOrder

        //third layer >>> select topicId,chapterId,topicName,[Order] from Topics_BookShopping where isdeleted = 0 order by chapterId,[Order]

        //final layer >>>> select AutoId, BookCoverNote as BookName,BookTopics as description,imgpath as coverUrl,pdfName as  pdfUrl,topicid,chapterId,subjectId,OrderID as pdforder,ispdf,HtmlContent
        //from Book_MasterDuplicate_APP
        //where show = 'yes' and age_group = '' order by coalesce(topicId, chapterid), OrderID,createddate
        public async Task<IActionResult> Index()
        {
            var viewModel = new DashboardModel
            {
                Subjects = await GetListingAsync()
            };
            return View(viewModel);
        }

        private async Task<List<Subject>> GetListingAsync()
        {
            var subjects = new List<Subject>();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Fetch subjects
                var subjectCommand = new SqlCommand("SELECT subId, ContentType, subjectName, bookOrder FROM Subject_BookShopping WHERE isDeleted = 0 ORDER BY bookOrder", connection);
                using (var reader = await subjectCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var subject = new Subject
                        {
                            SubId = reader.GetInt32(0),
                            ContentType = reader.GetString(1),
                            SubjectName = reader.GetString(2),
                            BookOrder = reader.GetInt32(3),
                            Chapters = new List<Chapter>()
                        };
                        subjects.Add(subject);
                        _subjects.Add(subject);
                    }
                }
                // Fetch chapters
                var chapterCommand = new SqlCommand("SELECT chapterId, subId, chapterName, chapterOrder, HasTopics FROM chapters_BookShopping WHERE isDeleted = 0 ORDER BY subId, chapterOrder", connection);
                using (var reader = await chapterCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var chapter = new Chapter
                        {
                            ChapterId = reader.GetInt32(0),
                            SubId = reader.GetInt32(1),
                            ChapterName = reader.IsDBNull(2) ? null : reader.GetString(2),
                            ChapterOrder = reader.GetInt32(3),
                            HasTopics = reader.GetBoolean(4)

                        };
                        _chapters.Add(chapter);
                        // Add chapter to the corresponding subject
                        var subject = subjects.FirstOrDefault(s => s.SubId == chapter.SubId);
                        subject?.Chapters.Add(chapter);
                    }
                }
                // Fetch topics
                var topicCommand = new SqlCommand("SELECT topicId, chapterId, topicName, [Order] FROM Topics_BookShopping WHERE isDeleted = 0 ORDER BY chapterId, [Order]", connection);
                using (var reader = await topicCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var topic = new Topic
                        {
                            TopicId = reader.GetInt32(0),
                            ChapterId = reader.GetInt32(1),
                            TopicName = reader.IsDBNull(2) ? null : reader.GetString(2),
                            Order = reader.GetInt32(3),
                            Books = new List<Book>()
                        };
                        _topics.Add(topic);
                        // Add topic to the corresponding chapter
                        var chapter = _chapters.FirstOrDefault(c => c.ChapterId == topic.ChapterId);
                        chapter?.Topics?.Add(topic);


                    }
                }
                // Fetch books
                var bookCommand = new SqlCommand("SELECT AutoId, BookCoverNote AS BookName, BookTopics AS description, imgpath AS coverUrl, pdfName AS pdfUrl, topicid, chapterId, subjectId, OrderID AS pdforder, ispdf, HtmlContent FROM Book_MasterDuplicate_APP WHERE show = 'yes' AND age_group = '' ORDER BY COALESCE(topicId, chapterId), OrderID, createddate", connection);
                using (var reader = await bookCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var book = new Book
                        {
                            AutoId = reader.GetInt32(0),
                            BookName = reader.IsDBNull(1) ? null : reader.GetString(1),
                            Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                            CoverUrl = reader.IsDBNull(3) ? null : reader.GetString(3),
                            PdfUrl = reader.IsDBNull(4) ? null : reader.GetString(4),
                            TopicId = await reader.IsDBNullAsync(5) ? null : reader.GetInt32(5),
                            ChapterId = reader.GetInt32(6),
                            SubjectId = reader.GetInt32(7),
                            PdfOrder = await reader.IsDBNullAsync(8) ? 1 : reader.GetInt32(8),
                            IsPdf = reader.GetBoolean(9),
                            HtmlContent = await reader.IsDBNullAsync(10) ? null : reader.GetString(10)

                        };
                        _books.Add(book);
                        // Add book to the corresponding topic
                        var topic = _topics.FirstOrDefault(t => t.TopicId == book.TopicId);
                        topic?.Books.Add(book);
                        // Add book to the corresponding chapter if no topic
                        if (topic == null)
                        {
                            var chapter = _chapters.FirstOrDefault(c => c.ChapterId == book.ChapterId);
                            chapter?.Books?.Add(book);
                        }
                    }
                }

            }
            return subjects;



        }
    }
}
