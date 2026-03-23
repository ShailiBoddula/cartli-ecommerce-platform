package com.shopsy.backend.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import java.util.List;

@Embeddable
public class Sizes {

    @ElementCollection
    private List<String> sizes;

    public Sizes() {}

    public Sizes(List<String> sizes) {
        this.sizes = sizes;
    }

    public List<String> getSizes() {
        return sizes;
    }

    public void setSizes(List<String> sizes) {
        this.sizes = sizes;
    }
}