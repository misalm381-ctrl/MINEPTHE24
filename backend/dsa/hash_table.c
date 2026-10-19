```c
#include <stdio.h>
#include <string.h>

#define TABLE_SIZE 101
#define MAX_TITLE 100
#define MAX_ISBN 30

typedef struct
{
    char isbn[MAX_ISBN];
    char title[MAX_TITLE];
    int occupied;
} BookEntry;

BookEntry hashTable[TABLE_SIZE];

unsigned int hashFunction(const char *isbn)
{
    unsigned int hash = 0;

    while (*isbn)
    {
        hash = (hash * 31) + (unsigned char)(*isbn);
        isbn++;
    }

    return hash % TABLE_SIZE;
}

void initializeHashTable()
{
    int i;

    for (i = 0; i < TABLE_SIZE; i++)
    {
        hashTable[i].occupied = 0;
        hashTable[i].isbn[0] = '\0';
        hashTable[i].title[0] = '\0';
    }
}

int insertBook(const char *isbn, const char *title)
{
    unsigned int index;
    unsigned int startIndex;

    index = hashFunction(isbn);
    startIndex = index;

    while (hashTable[index].occupied)
    {
        if (strcmp(hashTable[index].isbn, isbn) == 0)
        {
            strcpy(hashTable[index].title, title);
            return 1;
        }

        index = (index + 1) % TABLE_SIZE;

        if (index == startIndex)
        {
            return 0;
        }
    }

    strcpy(hashTable[index].isbn, isbn);
    strcpy(hashTable[index].title, title);
    hashTable[index].occupied = 1;

    return 1;
}

const char *searchBook(const char *isbn)
{
    unsigned int index;
    unsigned int startIndex;

    index = hashFunction(isbn);
    startIndex = index;

    while (hashTable[index].occupied)
    {
        if (strcmp(hashTable[index].isbn, isbn) == 0)
        {
            return hashTable[index].title;
        }

        index = (index + 1) % TABLE_SIZE;

        if (index == startIndex)
        {
            break;
        }
    }

    return NULL;
}

void displayHashTable()
{
    int i;

    printf("\n========== MINEPTHE HASH TABLE ==========\n");

    for (i = 0; i < TABLE_SIZE; i++)
    {
        if (hashTable[i].occupied)
        {
            printf(
                "Index %d | ISBN: %s | Book: %s\n",
                i,
                hashTable[i].isbn,
                hashTable[i].title
            );
        }
    }

    printf("=========================================\n");
}

int main()
{
    const char *result;

    initializeHashTable();

    insertBook(
        "9780131103627",
        "The C Programming Language"
    );

    insertBook(
        "9780262033848",
        "Introduction to Algorithms"
    );

    insertBook(
        "9780132350884",
        "Clean Code"
    );

    displayHashTable();

    printf("\nSearching for ISBN 9780262033848...\n");

    result = searchBook("9780262033848");

    if (result != NULL)
    {
        printf("Book Found: %s\n", result);
    }
    else
    {
        printf("Book Not Found.\n");
    }

    return 0;
}
```
