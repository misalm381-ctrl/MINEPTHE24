#include <stdio.h>

#define MAX_BOOKS 100

typedef struct
{
    int id;
    char title[100];
    int matchScore;
} Book;

/* Search for a book using its ID */
int searchBook(Book books[], int count, int id)
{
    int i;

    for (i = 0; i < count; i++)
    {
        if (books[i].id == id)
        {
            return i;
        }
    }

    return -1;
}

/* Sort books from highest match score to lowest */
void sortBooksByMatchScore(Book books[], int count)
{
    int i;
    int j;
    Book temporary;

    for (i = 0; i < count - 1; i++)
    {
        for (j = 0; j < count - i - 1; j++)
        {
            if (books[j].matchScore < books[j + 1].matchScore)
            {
                temporary = books[j];
                books[j] = books[j + 1];
                books[j + 1] = temporary;
            }
        }
    }
}

/* Display all books */
void displayBooks(Book books[], int count)
{
    int i;

    printf("\n=====================================\n");
    printf("       MINEPTHE BOOK RESULTS\n");
    printf("=====================================\n");

    for (i = 0; i < count; i++)
    {
        printf(
            "ID: %d | %s | Match: %d%%\n",
            books[i].id,
            books[i].title,
            books[i].matchScore
        );
    }
}

int main()
{
    Book books[MAX_BOOKS] =
    {
        {101, "Data Structures", 75},
        {102, "Database Management", 90},
        {103, "Operating Systems", 60},
        {104, "Computer Networks", 85}
    };

    int count = 4;
    int searchId = 102;
    int result;

    printf("=====================================\n");
    printf("       MINEPTHE SEARCH & SORT\n");
    printf("=====================================\n");

    printf("\nBefore sorting:");
    displayBooks(books, count);

    sortBooksByMatchScore(books, count);

    printf("\nAfter sorting by match score:");
    displayBooks(books, count);

    result = searchBook(books, count, searchId);

    printf("\nSearching for Book ID: %d\n", searchId);

    if (result != -1)
    {
        printf("Book found: %s\n", books[result].title);
    }
    else
    {
        printf("Book not found.\n");
    }

    return 0;
}