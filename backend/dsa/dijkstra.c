#include <stdio.h>

#define MAX_LOCATIONS 20
#define INF 999999

typedef struct
{
    int distance[MAX_LOCATIONS][MAX_LOCATIONS];
    int locationCount;
    char locations[MAX_LOCATIONS][50];
} Graph;

/* Initialize graph */
void initializeGraph(Graph *graph)
{
    graph->locationCount = 0;

    for (int i = 0; i < MAX_LOCATIONS; i++)
    {
        for (int j = 0; j < MAX_LOCATIONS; j++)
        {
            if (i == j)
                graph->distance[i][j] = 0;
            else
                graph->distance[i][j] = INF;
        }
    }
}

/* Add a location */
int addLocation(Graph *graph, const char name[])
{
    if (graph->locationCount >= MAX_LOCATIONS)
    {
        return -1;
    }

    int index = graph->locationCount;

    snprintf(
        graph->locations[index],
        sizeof(graph->locations[index]),
        "%s",
        name
    );

    graph->locationCount++;

    return index;
}

/* Add a road between two locations */
void addRoad(Graph *graph, int from, int to, int distance)
{
    graph->distance[from][to] = distance;
    graph->distance[to][from] = distance;
}

/* Find the unvisited location with minimum distance */
int findMinimumDistance(int distances[], int visited[], int count)
{
    int minimum = INF;
    int minimumIndex = -1;

    for (int i = 0; i < count; i++)
    {
        if (!visited[i] && distances[i] < minimum)
        {
            minimum = distances[i];
            minimumIndex = i;
        }
    }

    return minimumIndex;
}

/* Dijkstra shortest path algorithm */
void dijkstra(Graph *graph, int source)
{
    int distances[MAX_LOCATIONS];
    int visited[MAX_LOCATIONS];

    for (int i = 0; i < graph->locationCount; i++)
    {
        distances[i] = INF;
        visited[i] = 0;
    }

    distances[source] = 0;

    for (int count = 0; count < graph->locationCount - 1; count++)
    {
        int current = findMinimumDistance(
            distances,
            visited,
            graph->locationCount
        );

        if (current == -1)
        {
            break;
        }

        visited[current] = 1;

        for (int next = 0; next < graph->locationCount; next++)
        {
            if (!visited[next] &&
                graph->distance[current][next] != INF &&
                distances[current] != INF &&
                distances[current] + graph->distance[current][next] < distances[next])
            {
                distances[next] =
                    distances[current] +
                    graph->distance[current][next];
            }
        }
    }

    printf("\n=====================================\n");
    printf("       DIJKSTRA SHORTEST ROUTES\n");
    printf("=====================================\n");

    printf("\nStarting location: %s\n", graph->locations[source]);

    for (int i = 0; i < graph->locationCount; i++)
    {
        if (i == source)
        {
            continue;
        }

        printf("%s -> %d km\n",
               graph->locations[i],
               distances[i]);
    }
}

/* Main demonstration */
int main()
{
    Graph graph;

    initializeGraph(&graph);

    int college =
        addLocation(&graph, "College");

    int collectionPoint =
        addLocation(&graph, "Collection Point");

    int donor =
        addLocation(&graph, "Donor");

    int receiver =
        addLocation(&graph, "Receiver");

    addRoad(&graph, college, collectionPoint, 2);
    addRoad(&graph, collectionPoint, donor, 3);
    addRoad(&graph, college, receiver, 4);
    addRoad(&graph, receiver, collectionPoint, 1);

    dijkstra(&graph, receiver);

    return 0;
}