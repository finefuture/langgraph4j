package dev.langchain4j.image_to_diagram.actions;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.image_to_diagram.Diagram;
import dev.langchain4j.image_to_diagram.ImageToDiagram;
import dev.langchain4j.model.openai.OpenAiChatModel;
import lombok.NonNull;
import org.bsc.langgraph4j.action.AsyncNodeAction;
import org.bsc.langgraph4j.action.NodeAction;

import java.util.Map;

import static org.bsc.langgraph4j.action.AsyncNodeAction.node_async;

public class TranslateSequenceDiagramToPlantUML implements NodeAction<ImageToDiagram.State> {

    public static AsyncNodeAction<ImageToDiagram.State> of( @NonNull OpenAiChatModel model) {
        return node_async(new TranslateSequenceDiagramToPlantUML(model));
    }

    final OpenAiChatModel model;

    private TranslateSequenceDiagramToPlantUML(OpenAiChatModel model) {
        this.model = model;
    }

    @Override
    public Map<String, Object> apply(ImageToDiagram.State state) throws Exception {
        Diagram.Element diagram = state.diagram()
                .orElseThrow(() -> new IllegalArgumentException("no diagram provided!"));

        dev.langchain4j.model.input.Prompt systemPrompt = ImageToDiagram.loadPromptTemplate( "convert_sequence_diagram_to_plantuml.txt" )
                .apply( Map.of( "diagram_description", diagram));

        dev.langchain4j.model.output.Response<AiMessage> response = model.generate( new SystemMessage(systemPrompt.text()) );

        String result = response.content().text();

        return Map.of("diagramCode", result );

    }
}
