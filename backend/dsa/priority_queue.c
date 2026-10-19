```c
#include <stdio.h>

#define MAX_STUDENTS 100

typedef struct
{
    int studentId;
    int priority;
} Student;

typedef struct
{
    Student students[MAX_STUDENTS];
    int size;
} PriorityQueue;

void initializeQueue(PriorityQueue *queue)
{
    queue->size = 0;
}

void swap(Student *a, Student *b)
{
    Student temp = *a;
    *a = *b;
    *b = temp;
}

void insertStudent(
    PriorityQueue *queue,
    int studentId,
    int priority
)
{
    int index;

    if (queue->size >= MAX_STUDENTS)
    {
        printf("Priority queue is full.\n");
        return;
    }

    index = queue->size;

    queue->students[index].studentId = studentId;
    queue->students[index].priority = priority;

    queue->size++;

    while (index > 0)
    {
        int parent = (index - 1) / 2;

        if (queue->students[parent].priority >=
            queue->students[index].priority)
        {
            break;
        }

        swap(
            &queue->students[parent],
            &queue->students[index]
        );

        index = parent;
    }
}

Student removeHighestPriority(PriorityQueue *queue)
{
    Student result = {-1, -1};

    int index;
    int left;
    int right;
    int largest;

    if (queue->size == 0)
    {
        return result;
    }

    result = queue->students[0];

    queue->size--;

    if (queue->size == 0)
    {
        return result;
    }

    queue->students[0] =
        queue->students[queue->size];

    index = 0;

    while (1)
    {
        left = (2 * index) + 1;
        right = (2 * index) + 2;
        largest = index;

        if (left < queue->size &&
            queue->students[left].priority >
            queue->students[largest].priority)
        {
            largest = left;
        }

        if (right < queue->size &&
            queue->students[right].priority >
            queue->students[largest].priority)
        {
            largest = right;
        }

        if (largest == index)
        {
            break;
        }

        swap(
            &queue->students[index],
            &queue->students[largest]
        );

        index = largest;
    }

    return result;
}

void displayQueue(PriorityQueue *queue)
{
    int i;

    printf("\n====== MINEPTHE PRIORITY QUEUE ======\n");

    for (i = 0; i < queue->size; i++)
    {
        printf(
            "Student ID: %d | Priority: %d\n",
            queue->students[i].studentId,
            queue->students[i].priority
        );
    }

    printf("=====================================\n");
}

int main()
{
    PriorityQueue queue;

    Student student;

    initializeQueue(&queue);

    insertStudent(&queue, 101, 60);
    insertStudent(&queue, 102, 90);
    insertStudent(&queue, 103, 75);
    insertStudent(&queue, 104, 95);

    displayQueue(&queue);

    printf("\nProcessing students by priority...\n");

    while (queue.size > 0)
    {
        student = removeHighestPriority(&queue);

        printf(
            "Processing Student ID: %d | Priority: %d\n",
            student.studentId,
            student.priority
        );
    }

    return 0;
}
```
