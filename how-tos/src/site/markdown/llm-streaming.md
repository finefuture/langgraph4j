# Langchain4j LLM streaming

### Initialize Logger


```java
try( var file = new java.io.FileInputStream("./logging.properties")) {
    var lm = java.util.logging.LogManager.getLogManager();
    lm.checkAccess(); 
    lm.readConfiguration( file );
}

var log = org.slf4j.LoggerFactory.getLogger("llm-streaming");

```


```java
import dev.langchain4j.model.StreamingResponseHandler;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.output.Response;
import static dev.langchain4j.model.openai.OpenAiChatModelName.GPT_4_O_MINI;
import org.bsc.langgraph4j.langchain4j.generators.LLMStreamingGenerator;
import org.bsc.langgraph4j.state.AgentState;
import org.bsc.langgraph4j.streaming.StreamingOutput;

var generator = LLMStreamingGenerator.<AiMessage,AgentState>builder()
                        .mapResult( r -> Map.of( "content", r.content() ) )
                        .build();

StreamingChatLanguageModel model = OpenAiStreamingChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName(GPT_4_O_MINI)
    .build();

String userMessage = "Tell me a joke";

model.generate(userMessage, generator.handler() );

for( var r : generator ) {
    log.info( "{}", r);
}
  
log.info( "RESULT: {}", generator.resultValue().orElse(null) );
  
//Thread.sleep( 1000 );
```

    StreamingOutput{chunk=} 
    StreamingOutput{chunk=Why} 
    StreamingOutput{chunk= did} 
    StreamingOutput{chunk= the} 
    StreamingOutput{chunk= scare} 
    StreamingOutput{chunk=crow} 
    StreamingOutput{chunk= win} 
    StreamingOutput{chunk= an} 
    StreamingOutput{chunk= award} 
    StreamingOutput{chunk=?
    
    } 
    StreamingOutput{chunk=Because} 
    StreamingOutput{chunk= he} 
    StreamingOutput{chunk= was} 
    StreamingOutput{chunk= outstanding} 
    StreamingOutput{chunk= in} 
    StreamingOutput{chunk= his} 
    StreamingOutput{chunk= field} 
    StreamingOutput{chunk=!} 
    RESULT: {content=AiMessage { text = "Why did the scarecrow win an award?
    
    Because he was outstanding in his field!" toolExecutionRequests = null }} 

