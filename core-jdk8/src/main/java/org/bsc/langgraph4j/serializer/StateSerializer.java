package org.bsc.langgraph4j.serializer;

import lombok.NonNull;
import org.bsc.langgraph4j.state.AgentState;
import org.bsc.langgraph4j.state.AgentStateFactory;

import java.io.IOException;
import java.util.Map;

public abstract class StateSerializer<State extends AgentState> implements Serializer<State> {

    private final AgentStateFactory<State> stateFactory;

    protected StateSerializer( @NonNull  AgentStateFactory<State> stateFactory) {
        this.stateFactory = stateFactory;
    }

    public final AgentStateFactory<State> stateFactory() {
        return stateFactory;
    }

    public final State stateOf( @NonNull  Map<String,Object> data) {
        return stateFactory.apply(data);
    }

    public final State cloneObject( @NonNull  Map<String,Object> data) throws IOException, ClassNotFoundException {
        return cloneObject( stateFactory().apply(data) );
    }

}
