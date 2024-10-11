# How to add persistence ("memory") to your graph

Many AI applications need memory to share context across multiple interactions. In LangGraph4j, memory is provided for any [`StateGraph`] through [`Checkpointers`].

When creating any LangGraph workflow, you can set them up to persist their state by doing using the following:

1. A [`Checkpointer`], such as the [`MemorySaver`]
1. Pass your [`Checkpointers`] in configuration when compiling the graph.


[`StateGraph`]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/StateGraph.html
[`Checkpointers`]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/checkpoint/BaseCheckpointSaver.html
[`Checkpointer`]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/checkpoint/Checkpoint.html
[`MemorySaver`]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/checkpoint/MemorySaver.html

<!-- 
```java
String userHomeDir = System.getProperty("user.home");
String localRespoUrl = "file://" + userHomeDir + "/.m2/repository/";
String langchain4jVersion = "0.35.0"
```


```java
%dependency /add-repo local \{localRespoUrl} release|never snapshot|always
%dependency /list-repos
```


```java
%dependency /add org.bsc.langgraph4j:langgraph4j-core-jdk8:1.0-SNAPSHOT
%dependency /add org.bsc.langgraph4j:langgraph4j-langchain4j:1.0-SNAPSHOT
%dependency /add dev.langchain4j:langchain4j:\{langchain4jVersion}
%dependency /add dev.langchain4j:langchain4j-open-ai:\{langchain4jVersion}

%dependency /resolve
```

### Initialize Logger


```java
var lm = java.util.logging.LogManager.getLogManager();
lm.checkAccess(); 
try( var file = new java.io.FileInputStream("./logging.properties")) {
    lm.readConfiguration( file );
}
```
 -->
 
## Define the state

State is an (immutable) data class, inheriting from [`AgentState`], shared with all nodes in our graph. A state is basically a wrapper of a `Map<String,Object>` that provides some enhancers:

1. Schema (optional), that is a `Map<String,Channel>` where each [`Channel`] describe behaviour of the related property
1. `value()` accessors that inspect Map an return an Optional of value contained and cast to the required type

[`Channel`]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/state/Channel.html
[`AgentState`]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/state/AgentState.html


```java
import org.bsc.langgraph4j.state.AgentState;
import org.bsc.langgraph4j.state.Channel;
import org.bsc.langgraph4j.state.AppenderChannel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;

public class MessageState extends AgentState {

    static Map<String, Channel<?>> SCHEMA = Map.of(
            "messages", AppenderChannel.<AiMessage>of(ArrayList::new)
    );

    public MessageState(Map<String, Object> initData) {
        super( initData  );
    }

    List<? extends ChatMessage> messages() {
        return this.<List<? extends ChatMessage>>value( "messages" )
                .orElseThrow( () -> new RuntimeException( "messages not found" ) );
    }

    // utility method to quick access to last message
    Optional<? extends ChatMessage> lastMessage() {
        List<? extends ChatMessage> messages = messages();
        return ( messages.isEmpty() ) ? 
            Optional.empty() :
            Optional.of(messages.get( messages.size() - 1 ));
    }
}
```

## Register Serializers

Every object that should be stored into State **MUST BE SERIALIZABLE**. If the object is not `Serializable` by default, Langgraph4j provides a way to build and associate a custom [Serializer] to it. 

In the example, we use  [`Serializer`] for [ToolExecutionRequest] and [ChatMesssager] provided by langgraph4j integration module with langchain4j .

[Serializer]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/serializer/Serializer.html
[ChatMesssager]: https://docs.langchain4j.dev/apidocs/dev/langchain4j/data/message/ChatMesssager.html
[ToolExecutionRequest]: https://docs.langchain4j.dev/apidocs/dev/langchain4j/data/message/ToolExecutionRequest.html


```java
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.ToolExecutionResultMessage;
import dev.langchain4j.agent.tool.ToolExecutionRequest;
import org.bsc.langgraph4j.serializer.std.ObjectStreamStateSerializer;
import org.bsc.langgraph4j.langchain4j.serializer.std.ChatMesssageSerializer;
import org.bsc.langgraph4j.langchain4j.serializer.std.ToolExecutionRequestSerializer;
import org.bsc.langgraph4j.state.AgentStateFactory;

var stateSerializer = new ObjectStreamStateSerializer<MessageState>( MessageState::new );
stateSerializer.mapper()
    // Setup custom serializer for Langchain4j ToolExecutionRequest
    .register(ToolExecutionRequest.class, new ToolExecutionRequestSerializer() )
    // Setup custom serializer for Langchain4j AiMessage
    .register(ChatMessage.class, new ChatMesssageSerializer() )

```




    org.bsc.langgraph4j.serializer.std.SerializerMapper@3748372b



## Set up the tools

Using [langchain4j], We will first define the tools we want to use. For this simple example, we will
use create a placeholder search engine. However, it is really easy to create
your own tools - see documentation
[here][tools] on how to do
that.

[langchain4j]: https://docs.langchain4j.dev
[tools]: https://docs.langchain4j.dev/tutorials/tools


```java
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;

import java.util.Optional;

import static java.lang.String.format;

public class SearchTool {

    @Tool("Use to surf the web, fetch current information, check the weather, and retrieve other information.")
    String execQuery(@P("The query to use in your search.") String query) {

        // This is a placeholder for the actual implementation
        return "Cold, with a low of 13 degrees";
    }
}
```

## Set up the model

Now we will load the
[chat model].

1. It should work with messages. We will represent all agent state in the form of messages, so it needs to be able to work well with them.
2. It should work with [tool calling],meaning it can return function arguments in its response.

Note:
   >
   > These model requirements are not general requirements for using LangGraph4j - they are just requirements for this one example.
   >

[chat model]: https://docs.langchain4j.dev/tutorials/chat-and-language-models
[tool calling]: https://docs.langchain4j.dev/tutorials/tools   



```java
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.agent.tool.ToolSpecifications;

public record LLM( OpenAiChatModel model ) {
    public LLM() {
        this( 
            OpenAiChatModel.builder()
                .apiKey( System.getenv("OPENAI_API_KEY") )
                .modelName( "gpt-4o" )
                .logResponses(true)
                .maxRetries(2)
                .temperature(0.0)
                .maxTokens(2000)
                .build()   
            );
    }
}

```

## Test function calling


```java
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.agent.tool.ToolSpecifications;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.openai.OpenAiChatModel;

var llm = new LLM();

var tools = ToolSpecifications.toolSpecificationsFrom( SearchTool.class );

UserMessage userMessage = UserMessage.from("What will the weather be like in London tomorrow?");
Response<AiMessage> response = llm.model().generate(Collections.singletonList(userMessage), tools );
AiMessage aiMessage = response.content();

System.out.println( aiMessage );
```

    AiMessage { text = null toolExecutionRequests = [ToolExecutionRequest { id = "call_Pr6dnlhKtSPCvMbS2H7JnNnw", name = "execQuery", arguments = "{"query":"London weather forecast for tomorrow"}" }] }


## Define the graph

We can now put it all together. We will run it first without a checkpointer:



```java
import static org.bsc.langgraph4j.StateGraph.START;
import static org.bsc.langgraph4j.StateGraph.END;
import org.bsc.langgraph4j.StateGraph;
import org.bsc.langgraph4j.action.EdgeAction;
import static org.bsc.langgraph4j.action.AsyncEdgeAction.edge_async;
import org.bsc.langgraph4j.action.NodeAction;
import static org.bsc.langgraph4j.action.AsyncNodeAction.node_async;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.service.tool.DefaultToolExecutor;

// Route Message 
EdgeAction<MessageState> routeMessage = state -> {
  
  var lastMessage = state.lastMessage();
  
  if ( !lastMessage.isPresent()) return "exit";

  var message = (AiMessage)lastMessage.get();

  // If tools should be called
  if ( message.hasToolExecutionRequests() ) return "next";
  
  // If no tools are called, we can finish (respond to the user)
  return "exit";
};

var llm = new LLM();

// Call Model
NodeAction<MessageState> callModel = state -> {
  
  var response = llm.model().generate( (List<ChatMessage>)state.messages() );

  return Map.of( "messages", response.content() );
};

var searchTool = new SearchTool();


// Invoke Tool 
NodeAction<MessageState> invokeTool = state -> {

  var lastMessage = (AiMessage)state.lastMessage()
                          .orElseThrow( () -> ( new IllegalStateException( "last message not found!")) );

  var executionRequest = lastMessage.toolExecutionRequests().get(0);

  var executor = new DefaultToolExecutor( searchTool, executionRequest );

  var result = executor.execute( executionRequest, null );

  return Map.of( "messages", AiMessage.from( result ) );
};

// Define Graph

var workflow = new StateGraph<MessageState> ( MessageState.SCHEMA, stateSerializer )
  .addNode("agent", node_async(callModel) )
  .addNode("tools", node_async(invokeTool) )
  .addEdge(START, "agent")
  .addConditionalEdges("agent", edge_async(routeMessage), Map.of( "next", "tools", "exit", END ))
  .addEdge("tools", "agent");

var graph = workflow.compile();
```


```java

Map<String,Object> inputs = Map.of( "messages", AiMessage.from("Hi I'm Bartolo, niced to meet you.") );

var result = graph.stream( inputs );

for( var r : result ) {
  System.out.println( r.node() );
  if( r.node().equals("agent")) {
    System.out.println( r.state() );
  }
}
```

    __START__
    agent
    {messages=[AiMessage { text = "Hi I'm Bartolo, niced to meet you." toolExecutionRequests = null }, AiMessage { text = "Nice to meet you too, Bartolo! How can I assist you today?" toolExecutionRequests = null }]}
    __END__



```java

Map<String,Object> inputs = Map.of( "messages", AiMessage.from("Remember my name?") );

var result = graph.stream( inputs );

for( var r : result ) {
  System.out.println( r.node() );
  if( r.node().equals("agent")) {
    System.out.println( r.state() );
  }
}
```

    __START__
    agent
    {messages=[AiMessage { text = "Remember my name?" toolExecutionRequests = null }, AiMessage { text = "I'm sorry, but I don't have the ability to remember personal information or previous interactions. How can I assist you today?" toolExecutionRequests = null }]}
    __END__


## Add Memory

Let's try it again with a checkpointer. We will use the
[`MemorySaver`],
which will "save" checkpoints in-memory.

[`MemorySaver`]: https://bsorrentino.github.io/langgraph4j/apidocs/org/bsc/langgraph4j/checkpoint/MemorySaver.html


```java
import org.bsc.langgraph4j.checkpoint.MemorySaver; 
import org.bsc.langgraph4j.CompileConfig; 

// Here we only save in-memory
var memory = new MemorySaver();

var compileConfig = CompileConfig.builder()
                    .checkpointSaver(memory)
                    .build();

var persistentGraph = workflow.compile( compileConfig );
```


```java
import org.bsc.langgraph4j.RunnableConfig;

var runnableConfig =  RunnableConfig.builder()
                .threadId("conversation-num-1" )
                .build();

Map<String,Object> inputs = Map.of( "messages", AiMessage.from("Hi I'm Bartolo, niced to meet you.") );

var result = persistentGraph.stream( inputs, runnableConfig );

for( var r : result ) {
  System.out.println( r.node() );
  if( r.node().equals("agent")) {
    System.out.println( r.state().lastMessage().orElse(null) );
  }
}
```

    __START__
    agent
    AiMessage { text = "Hello Bartolo! Nice to meet you too. How can I assist you today?" toolExecutionRequests = null }
    __END__



```java

Map<String,Object> inputs = Map.of( "messages", AiMessage.from("Remember my name?") );

var result = persistentGraph.stream( inputs, runnableConfig );

for( var r : result ) {
  System.out.println( r.node() );
  if( r.node().equals("agent")) {
    System.out.println( r.state().lastMessage().orElse(null) );
  }
}
```

    __START__
    agent
    AiMessage { text = "Yes, your name is Bartolo. How can I assist you today?" toolExecutionRequests = null }
    __END__


## New Conversational Thread

If we want to start a new conversation, we can pass in a different
**`thread_id`**. Poof! All the memories are gone (just kidding, they'll always
live in that other thread)!



```java
runnableConfig =  RunnableConfig.builder()
                .threadId("conversation-2" )
                .build();
```


```java
inputs = Map.of( "messages", AiMessage.from("you know my name?") );

var result = persistentGraph.stream( inputs, runnableConfig );

for( var r : result ) {
  System.out.println( r.node() );
  if( r.node().equals("agent")) {
    System.out.println( r.state().lastMessage().orElse(null) );
  }
}
```

    __START__
    agent
    AiMessage { text = "I don't know your name unless you tell me. If you'd like to share it or if there's anything specific you'd like to discuss, feel free to let me know!" toolExecutionRequests = null }
    __END__
