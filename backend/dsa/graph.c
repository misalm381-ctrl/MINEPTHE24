```c
#include <stdio.h>

#define MAX_LOCATIONS 20
#define INF 999999

typedef struct
{
    int locationId;
    char name[50];
} Location;

typedef struct
{
    int locations[MAX_LOCATIONS][MAX_LOCATIONS];
    int locationCount;
} Graph;

void initializeGraph(Graph *graph)
{
    int i;
    int j;

    graph->locationCount = 0;

    for (i = 0; i < MAX_LOCATIONS; i++)
    {
        for (j = 0; j < MAX_LOCATIONS; j++)
        {
            if (i == j)
            {
                graph->locations[i][j] = 0;
            }
            else
            {
                graph->locations[i][j] = INF;
            }
        }
    }
}

int addLocation(Graph *graph)
{
    if (graph->locationCount >= MAX_LOCATIONS)
    {
        return -1;
    }

    return graph->locationCount++;
}

void addRoad(
    Graph *graph,
    int from,
    int to,
    int distance
)
{
    if (from < 0 ||
        to < 0 ||
        from >= graph->locationCount ||
        to >= graph->locationCount)
    {
        return;
    }

    graph->locations[from][to] = distance;
    graph->locations[to][from] = distance;
}

void displayGraph(Graph *graph)
{
    int i;
    int j;

    printf("\n========== MINEPTHE GRAPH ==========\n");

    for (i = 0; i < graph->locationCount; i++)
    {
        printf("Location %d:", i);

        for (j = 0; j < graph->locationCount; j++)
        {
            if (graph->locations[i][j] != INF &&
                i != j)
            {
                printf(
                    " -> %d (%d km)",
                    j,
                    graph->locations[i][j]
                );
            }
        }

        printf("\n");
    }

    printf("====================================\n");
}

int main()
{
    Graph graph;

    int college;
    int collectionPoint;
    int donor;
    int receiver;

    initializeGraph(&graph);

    college = addLocation(&graph);
    collectionPoint = addLocation(&graph);
    donor = addLocation(&graph);
    receiver = addLocation(&graph);

    addRoad(&graph, college, collectionPoint, 2);
    addRoad(&graph, collectionPoint, donor, 3);
    addRoad(&graph, college, receiver, 4);
    addRoad(&graph, receiver, collectionPoint, 1);

    displayGraph(&graph);

    printf("\nMINEPTHE location graph created successfully.\n");

    return 0;
}
```
